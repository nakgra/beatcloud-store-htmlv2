# beatcloud 店舗側 html

## セットアップ

1. コード例はシェルスクリプト前提です。
2. 必要なインストールバージョンは「バージョン情報」を参照してください。

### 1. Node.js, npm, yarn

下記より、必要なバージョンのLTSをインストールしてください。
https://nodejs.org/ja/download/releases/

nvmがおすすめです。
https://github.com/coreybutler/nvm-windows

インストールできたら、`npm`をアップデートします。

    $ npm install -g npm

yarnもインストールします。

    $ npm install -g yarn


### 2. パッケージインストール

`package.json`にあるパッケージをインストールします。

    $ cd 作業フォルダ
    $ yarn install


### 3. ビルド

    $ yarn start

これで、ローカルサーバーが起動し、ソースコードの編集はリアルタイムに反映される様になります。

単純なソースコードのビルドは

    $ yarn build

または、本番モード（コードを圧縮する）でのビルド

    $ yarn build --env=product




## バージョン情報

* node v18.x



## JSON server

非同期通信によってデータを取得する実装をモックアップで実現するために、json-serverをインストールします。

    $ npm install -g json-server

gulpを実行するのとは別のターミナルからサーバーを起動します。

    # json-server --routes ./jsonserver/route.json --middlewares ./jsonserver/middleware.js --watch ./jsonserver/db.json


## PDF変換

    wkhtmltopdf --enable-local-file-access --disable-smart-shrinking --margin-top 2mm --margin-bottom 2mm --margin-left 3mm --margin-right 3mm ./dist/pdf/deliveryslip.html ./pdf/deliveryslip.pdf