import os
import requests
from tqdm import tqdm

oauth_token = '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'

target = [
    'mmcv',
    'mmengine',
    'mmeval',
    'mim',
    'mmaction2',
    'mmpretrain',
    'mmdetection',
    'mmdetection3d',
    'mmagic',
    'mmocr',
    'mmpose',
    'mmsegmentation',
    'mmtracking',
    'mmflow',
    'mmfewshot',
    'mmhuman3d',
    'mmrazor',
    'mmdeploy',
    'mmrotate',
    'mmyolo',
]

for t in target:
    # 设置GitHub仓库信息
    repository_url = f"https://api.github.com/repos/open-mmlab/{t}/contents/docs/zh_cn"
    headers = {"Accept": "application/vnd.github.v3+json",
               "Authorization": f"Bearer {oauth_token}"}

    # 发起API请求并获取仓库内容
    response = requests.get(repository_url, headers=headers)
    if response.status_code != 200:
        repository_url = f"https://api.github.com/repos/open-mmlab/{t}/contents/docs/zh_CN"
        headers = {"Accept": "application/vnd.github.v3+json",
                   "Authorization": f"Bearer {oauth_token}"}

        # 发起API请求并获取仓库内容
        response = requests.get(repository_url, headers=headers)
        if response.status_code != 200:
            print(f"{t}工具箱文档请求失败，错误码：", response.status_code)
            continue
    print(f"{t}工具箱文档请求成功。开始提取Markdown文件。")
    data = response.json()

    # 创建保存文件的根目录
    root_directory = f"md/OpenMMLab/{t}"
    if not os.path.exists(root_directory):
        os.makedirs(root_directory)


    # 递归函数用于下载文件和子目录
    def download_contents(contents, current_path):
        for item in tqdm(contents):
            item_path = os.path.join(current_path, item["name"])

            if item["type"] == "file" and item["name"].endswith(".md"):
                # 下载并保存Markdown文件
                download_url = item["download_url"]
                file_response = requests.get(download_url)
                with open(item_path, "wb") as f:
                    f.write(file_response.content)
            elif item["type"] == "dir":
                # 递归下载子目录
                os.makedirs(item_path, exist_ok=True)
                sub_contents_url = item["url"]
                sub_response = requests.get(sub_contents_url, headers=headers)
                sub_data = sub_response.json()
                download_contents(sub_data, item_path)


    # 开始下载
    download_contents(data, root_directory)
    print("Markdown文件已保存完成。")
