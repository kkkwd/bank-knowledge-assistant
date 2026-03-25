import anthropic

from app.core.config import settings
from app.schemas.chat import RetrievedChunk


class LLMService:
    def __init__(self) -> None:
        self.model_name = settings.llm_model
        self.client = anthropic.Anthropic(
            api_key=settings.anthropic_api_key,
            base_url=settings.anthropic_base_url,
        )

    def answer_question(self, question: str, retrieved_chunks: list[RetrievedChunk]) -> str:
        if not retrieved_chunks:
            return "未检索到相关资料，请尝试换一种问法，或先确认对应文档已经完成索引。"

        message = self.client.messages.create(
            model=self.model_name,
            max_tokens=settings.llm_max_tokens,
            temperature=settings.llm_temperature,
            system=self._build_system_prompt(),
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": self._build_user_prompt(question, retrieved_chunks),
                        }
                    ],
                }
            ],
        )

        texts = [block.text for block in message.content if getattr(block, "type", None) == "text"]
        answer = "\n".join(item.strip() for item in texts if item.strip()).strip()
        if not answer:
            raise RuntimeError("LLM returned empty text content")
        return answer

    def _build_system_prompt(self) -> str:
        return (
            "你是银行知识库问答助手。"
            "你必须仅依据提供的检索资料回答，不能编造资料中没有的信息。"
            "如果资料不足以支持明确结论，应直接说明资料不足。"
            "回答使用简洁专业的中文。"
        )

    def _build_user_prompt(self, question: str, retrieved_chunks: list[RetrievedChunk]) -> str:
        context_blocks: list[str] = []
        for index, chunk in enumerate(retrieved_chunks, start=1):
            page_label = f"，第{chunk.page_number}页" if chunk.page_number else ""
            context_blocks.append(
                f"[资料{index}] 文档：{chunk.document_name}{page_label}\n"
                f"内容：{chunk.content}"
            )

        context = "\n\n".join(context_blocks)
        return (
            f"用户问题：{question}\n\n"
            "请严格依据下面的资料作答。\n"
            "回答要求：\n"
            "1. 先直接回答问题。\n"
            "2. 若答案涉及条件、利率、期限、对象等关键字段，请明确列出。\n"
            "3. 若资料不足，请明确说明“根据当前检索资料无法确认”。\n"
            "4. 不要输出你未从资料中得到的内容。\n\n"
            f"检索资料：\n{context}"
        )
