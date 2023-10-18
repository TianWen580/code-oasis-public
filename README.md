![img1](https://github.com/sugarforever/LangChain-Types-Explained/assets/62822224/f6a89450-de11-4903-9ad8-fa259b68d206)



# ⛺CODE OASIS

## 🛒Front-end setup

> Uniapp Cloud Serve is needed

### Basic requirements

Go into `code-oasis`.

```shell
cd code-oasis
```

Try this command after you are in  `code-oasis/`.

```shell
npm install
```
### Uni-app setup

Our project's cloud database was built with Uni-app，You are willing to register for an acount of Uniapp, and create a new Aliyun Server Space for cloud develope envoriment(free of charge). Then install plug-ins as listed if you use VS Code as your IDE(otherwise, skip this step).

- uni-app-helper
- uni-create-view
- Vetur
- Vite
- Vue Language Features(Volar)

If you want to get your envoriment for Unicloud develope in a convinient way, try HBuilder rather than VS Code. Plus, just upload the Cloud Functions in `code-oasis/uniCloud-aliyun` and you will find a dumped json file `lessons-dump.json` in this dir which you are needed to create a database table called `lessons` to import this file as the basic lessons in Code Oasis. Meanwhile, create another two tables `uni-id-users` and `userSubmitLessons` for users management and lesson creating, respectively.

If you have any problem, check these references:

- [这可能是最好、最详细的VSCode开发uni-app教程吧 - 掘金](https://juejin.cn/post/7090532271257714695#heading-14)
- [uni-app官方文档](https://uniapp.dcloud.net.cn/api/)

### 😉Compiles and hot-reloads for front-end

```shell
npm run dev:h5
```

## Back-end setup

> Because of  network envoriment,  huggingface embedding may be unable to initialize sometimes.

### Premise

No GPU needed, so you are only supposed to check if you have the python libs as follows(anaconda is recommended for python management):

```shell
python>=3.8
torch>=1.13.1
torchvision>=0.14.1
```

### Other Libs

Back to root folder, and go into `server/` .

```shell
cd server
```

Try this command for requirements of backend server. If you encounter with problems with `Import Error`, you may try to reuse `pip install ...` to prepare them.

```shell
pip install -r requirements.txt
```

### Launch!

If you are willing to do some developing, you can run the `serve.py` conviniently.

```python
python serve.py
```

If you deploy it for production needs, try to prepare `nginx`([ref](https://blog.csdn.net/weixin_62870380/article/details/130147326#:~:text=三、配置nginx%201%201.配置两个网卡（192.168.191.100和192.168.191.200）%202%202.启动ens33网卡%203%203.进入%20%2Fusr%2Flocal%2Fnginx%2Fhtml%2F配置我们的网页内容,5.在文件下创建相关文件%206%206.配置虚拟主机文件，进入到%2Fusr%2Flocal%2Fnginx%2Fconf%2F%207%207.编辑nginx.conf文件%208%208.编辑以下内容%20更多项目)) , or you can directly run the `service.py` for `Tornado` to process concurrent.

```shell
python service.py
```



![img2](https://github.com/sugarforever/LangChain-Types-Explained/assets/62822224/a630c450-cd60-4e98-9f47-143aee6a933d)