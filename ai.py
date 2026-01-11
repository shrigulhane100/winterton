
import os
import base64
from openai import AzureOpenAI

endpoint = os.getenv("ENDPOINT_URL", "https://first-hackathon.openai.azure.com/")
deployment = os.getenv("DEPLOYMENT_NAME", "gpt-35-turbo")
subscription_key = os.getenv("AZURE_OPENAI_API_KEY", "")

# Initialize Azure OpenAI client with key-based authentication
client = AzureOpenAI(
    azure_endpoint=endpoint,
    api_key=subscription_key,
    api_version="2025-01-01-preview",
)


#Prepare the chat prompt
chat_prompt = [
    {
        "role": "user",
        "content": "ID\tQuestion Statement\tOption 1\tOption 2\tOption 3\tOption 4\tCorrect Option\t\n1\tWhat is a binary classifier?\tA model that categorizes data into multiple classes.\tA model that separates data into exactly two classes.\tA model that predicts continuous numeric values.\tA model that clusters unlabeled data.\toption2\t\n2\tWhich metric is used to measure the accuracy of a binary classifier?\tMean Squared Error (MSE).\tF1-Score.\tEntropy.\tCosine Similarity.\toption2\t\n3\tWhat does the confusion matrix for a binary classifier include?\tTrue Positives, True Negatives, False Positives, False Negatives.\tOnly True Positives and True Negatives.\tProbability Distributions.\tCluster Centroids.\toption1\t\n4\tWhich of the following is an example of binary classification?\tPredicting house prices.\tIdentifying whether an email is spam or not spam.\tClustering customers into segments.\tRecognizing handwritten digits (0-9).\toption2\t\n5\tWhat is precision in the context of a binary classifier?\tThe proportion of true positives among all positive predictions.\tThe proportion of true negatives among all negative predictions.\tThe proportion of true positives among all actual positives.\tThe overall percentage of correct predictions.\toption1"
    },
    {
        "role": "assistant",
        "content": "### Quiz Evaluation Results:\n\n1. **Question 1:**\n   - User's Answer: A model that separates data into exactly two classes.\n   - Correct Answer: A model that separates data into exactly two classes.\n   - Explanation: A binary classifier is a model that classifies data into exactly two classes.\n\n2. **Question 2:**\n   - User's Answer: F1-Score.\n   - Correct Answer: F1-Score.\n   - Explanation: F1-Score is a metric commonly used to measure the accuracy of a binary classifier.\n\n3. **Question 3:**\n   - User's Answer: True Positives, True Negatives, False Positives, False Negatives.\n   - Correct Answer: True Positives, True Negatives, False Positives, False Negatives.\n   - Explanation: The confusion matrix for a binary classifier includes True Positives, True Negatives, False Positives, and False Negatives.\n\n4. **Question 4:**\n   - User's Answer: Identifying whether an email is spam or not spam.\n   - Correct Answer: Identifying whether an email is spam or not spam.\n   - Explanation: Identifying whether an email is spam or not spam is an example of binary classification as it involves categorizing data into two classes.\n\n5. **Question 5:**\n   - User's Answer: The proportion of true positives among all positive predictions.\n   - Correct Answer: The proportion of true positives among all positive predictions.\n   - Explanation: Precision in the context of a binary classifier refers to the proportion of true positives among all positive predictions.\n\nOverall, your responses were mostly correct. Keep up the good work! If you have any more questions or need further clarification, feel free to ask."
    }
]

# Include speech result if speech is enabled
messages = chat_prompt

# Generate the completion
completion = client.chat.completions.create(
    model=deployment,
    messages=messages,
    max_tokens=800,
    temperature=0.7,
    top_p=0.95,
    frequency_penalty=0,
    presence_penalty=0,
    stop=None,
    stream=False
)

print(completion.to_json())
    