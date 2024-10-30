# README

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
