import os
from openai import OpenAI
from utils.prompts import COMPLIANCE_PROMPTS

class ComplianceLLM:
    def __init__(self):
        # Ensure you set OPENAI_API_KEY in your environment
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def rewrite_copy(self, text, violation_type):
        """
        Rewrites text to remove specific violations defined in Appendix B.
        References:
        - "Detect competition copy. Not allowed." [cite: 5]
        - "Detect any 'green' claim. Not allowed." [cite: 5]
        - "No copy element can refer to prices... discounts or deals." [cite: 6]
        """
        
        # Select the correct prompt based on violation
        system_prompt = COMPLIANCE_PROMPTS.get(violation_type, COMPLIANCE_PROMPTS["general"])
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo", # or gpt-4
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Fix this compliant-violating text: '{text}'"}
                ],
                temperature=0.3 # Low temperature for strict adherence
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"LLM Error: {e}")
            return text # Fail safe: return original