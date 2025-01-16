# README
▽アプリの概要
私達がつくったアプリの名前はPrettie（プリッティ）です。
メイクの方法やコスメといった美容情報を投稿・共有ができるコミュニティサイトです。

▽ターゲット層
オタク女子、メイク初心者、メイクのやり方がわからない方、メイクを始めたいと思っている男性の方も○

▽利用目的
メインは就活時のメイク方法が学べることやコスメの管理。プラスで技術や情報を取得したいとか

▽使用することで得られる効果・メリット
いままでメイクをしてこなかったターゲットがアプリを通して楽しくよりよい人生を歩める効果を期待しています。
コスメの管理を機能を使用することで、化粧品の状況を把握することができ、余分な心配がなくなる。
同じ悩みを持った人やその悩みを解決できるであろう人と交流することで、相談や問題解決につながる。

▽主な機能(抜粋3点)
・パーソナルカラー診断
いくつかの質問に答えて、自分に似合う色を知ることができる。
・コスメ管理機能
自分の持っているコスメの使用期限や在庫管理を把握することができる。
・タブの追加機能
タイムラインの投稿など、パーソナルカラー別に表示を限定する際に使用する。

▽使用環境
・Vercel

▽使い方
　新規の方 「新規登録　→　ログイン」
　登録済みの方 「ログイン」
　
インストール方法
　
今後の計画
・特に考えていません。

## ◉firebase storageにおけるcors関連 :
[gsutilのインストール](https://cloud.google.com/storage/docs/gsutil_install?hl=ja#deb) 
1. updateする
```terminal
sudo apt-get update
```
2. apt-transport-httpsとcurlがあるか確認する
```terminal
sudo apt-get install apt-transport-https ca-certificates gnupg curl
```
3. 公開鍵のインポート
```terminal
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg
```
4. gcloudCLIの配布URIをパッケージソースとして追加
```terminal
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
```
5. gcloudCLIを更新してインストール
```terminal
sudo apt-get update && sudo apt-get install google-cloud-cli
```
6. GraduationTask/直下でinit
```terminal
gcloud init
```
- cors.jsonのセット
```terminal
gsutil cors set cors.json gs://***...
```
Setting CORS on gs://************.appspot.com/...てなる
- cors.jsonの確認
``` terminal
gsutil cors get gs://***...
```
