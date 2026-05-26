body = {
            "model": "llama3-70b-8192",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 1000
        }
        response = requests.post(AI_API_URL, headers=headers, json=body)
        response.raise_for_status()
        data = response.json()
        ai_response = data["choices"][0]["message"]["content"]