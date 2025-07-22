import os
from dotenv import load_dotenv
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential
from crewai.llm import LLM
from typing import List, Dict

load_dotenv()
token = os.getenv("GITHUB_TOKEN")
endpoint = "https://models.github.ai/inference"
#model_name = "openai/gpt-4.1"
model_name ="openai/gpt-4.1-nano"


class AzureGitHubLLM(LLM):
    def __init__(self):
        self.client = ChatCompletionsClient(
            endpoint=endpoint,
            credential=AzureKeyCredential(token)
        )
        self.model = model_name
        self.model_name = model_name  # Required by CrewAI

    def call(self, messages: List[Dict], **kwargs) -> str:
        azure_messages = [
            SystemMessage(content=msg["content"]) if msg["role"] == "system"
            else UserMessage(content=msg["content"]) for msg in messages
        ]
        response = self.client.complete(
            messages=azure_messages,
            temperature=kwargs.get("temperature", 0.7),
            top_p=kwargs.get("top_p", 1.0),
            max_tokens=kwargs.get("max_tokens", 30000),
            model=self.model
        )
        return response.choices[0].message.content

    @property
    def _llm_type(self) -> str:
        return "azure_github_models"
