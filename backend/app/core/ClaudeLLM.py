import openai
from crewai.llm import LLM
from typing import List, Dict
import os
from dotenv import load_dotenv

load_dotenv()

llm_api_key = os.getenv("API_KEY")
llm_base_url= os.getenv("BASE_URL")
class ClaudeLLM(LLM):
    def __init__(self):
        self.client = openai.OpenAI(
            api_key=llm_api_key,
            base_url=llm_base_url
        )
        self.model_name = "vertex_ai/claude3.7-sonnet"  # Change as needed
        self.model = self.model_name
    def call(self, messages: List[Dict], **kwargs) -> str:
        # Claude via OpenAI proxy supports OpenAI format (assumed by CrewAI)
        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            temperature=kwargs.get("temperature", 0.7),
            top_p=kwargs.get("top_p", 1.0),
            max_tokens=kwargs.get("max_tokens", 64000)
        )
        return response.choices[0].message.content

    @property
    def _llm_type(self) -> str:
        return "claude_openai_compatible"
