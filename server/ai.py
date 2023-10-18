import requests
import os
import json


class AI:
    def __init__(self, chatgpt_api='https://api.zhtec.xyz/xht/5eSLgrSzJd.php', model='gpt-3.5-turbo', cache=True):
        self.chatgpt_api = chatgpt_api
        self.model = model
        self.generated_code_cache = {}
        self.cache_file = "code_cache.json"
        self.cache = cache
        if cache:
            if os.path.exists(self.cache_file):
                with open(self.cache_file, "r") as f:
                    self.generated_code_cache = json.load(f)

    def __getattr__(self, method_name):
        def method(*args, **kwargs):
            generated_code = self.__call_chatgpt(method_name, *args, **kwargs)
            return generated_code

        return method

    def list_cached_methods(self):
        with open(self.cache_file, 'r') as f:
            data = json.load(f)
        print(list(data.keys()))

    def check_cached_method(self, key='a的b次幂'):
        with open(self.cache_file, 'r') as f:
            data = json.load(f)
        if key in data:
            print(f'方法<{key}>存在')
        else:
            print(f'方法<{key}>不存在')

    def delete_cached_method(self, key='a的b次幂'):
        with open(self.cache_file, 'r') as f:
            data = json.load(f)
        if key in data:
            del data[key]
            print(f'方法<{key}>删除成功')
        else:
            print(f'方法<{key}>不存在')
        with open(self.cache_file, 'w') as f:
            json.dump(data, f)

    def __call_chatgpt(self, method_name, *args, **kwargs):
        prompt = f'''
- 你是一个乐于助人的python专家，擅长编写各种python函数
    - 请帮我编写一个Python函数，函数命名为<{method_name}>
    - 你不可以对函数名做任何改动！传入的参数示例为：*{args}
    - 请给每个参数都设置一个默认参数。保证用户传参和函数要求一致
    - 导包务必放到函数内,注意导入所有所需的包
    - 不要只有函数定义，最后要有函数调用
    - 请根据函数名和参数示例推理并实现该函数，不能用pass敷衍！
    - 函数的结果必须要<return出来>而不是print
    - 不需要测试！要求只输出代码，无需任何解释'''
        headers = {
            "Content-Type": "application/json"
        }

        try:
            data = {'model': self.model, 'messages': [{'role': 'user', 'content': prompt}]}

            response = requests.post(self.chatgpt_api, headers=headers, data=json.dumps(data), stream=True)
            assistant_response = ''
            for chunk in response.iter_lines():
                if chunk:
                    decoded_chunk = chunk.decode('utf-8')
                    if decoded_chunk.startswith('data:'):
                        # Remove the 'data: ' prefix and parse the JSON object
                        try:
                            parsed_chunk = json.loads(decoded_chunk[5:])
                            assistant_response += parsed_chunk['choices'][0]['delta']['content']
                        except:
                            pass

            # assistant_response = response.json()['choices'][0]['message']['content']
            return assistant_response.replace('```python', '').replace('```', '').strip()
        except Exception as e:
            print(f"生成或执行代码时出错: {e}")
