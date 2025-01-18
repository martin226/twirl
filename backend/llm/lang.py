from langgraph import create_react_agent
from langchain_anthropic import ChatAnthropic
from langchain_core.tools import tool

@tool
def process_text(text: str) -> str:
    """Process input text and return processed result"""
    processed_text = "adfkjaskjgiurgergeregeqrgerlgergkljergkleljkeq"
    return processed_text

@tool
def analyze_image(image_path: str) -> str:
    """Analyze an image and return analysis results"""
    analysis_results = "alkjsdfhaskljfsjahglkjashdkfjsahdf"
    return analysis_results

model = ChatAnthropic(model="claude-3-sonnet-20240229")

agent = create_react_agent(
    llm=model,
    tools=[process_text, analyze_image],
    system_message="You are an assistant that processes text and analyzes images."
)

if __name__ == "__main__":
    agent.run()