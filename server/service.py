from serve import app
import sys
import asyncio

from tornado.ioloop import IOLoop
from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer


# Python3.8的asyncio改变了循环方式，因为这种方式在windows上不支持相应的add_reader APIs，就会抛出NotImplementedError错误。
# 因此在python3.8及更高版本需要加入下面两行代码，其他版本不需要
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

if __name__ == '__main__':
    http_server = HTTPServer(WSGIContainer(app))
    http_server.listen(5000)
    IOLoop.current().start()
