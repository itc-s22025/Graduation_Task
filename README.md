# README

## アプリの概要
私たちのアプリ「Prettie（プリッティ）」は、美容情報を投稿・共有できるコミュニティサイトです。主にメイクの方法やコスメに関する情報を交換することができます。

## 作成者
- 大城 久乃 (s22006@std.it-college.ac.jp)
- 玉城 愛梨 (s22016@std.it-college.ac.jp)
- 半嶺 凜 　(s22025@std.it-college.ac.jp)
- 運天 涼歌 (n23005@std.it-college.ac.jp)

## 使用環境
- Vercel（ホスティング/デプロイ）
  https://graduation-task-ppg.vercel.app/

## 開発環境
- WebStorm（IDE）

## 使用技術
- Next.js（フレームワーク）
- Firebase（バックエンド）

## ターゲット層
- オタク女子
- メイク初心者
- メイク方法がわからない方
- メイクを始めたい男性

## 利用目的
主にメイク方法を学ぶこと目的としています。あわよくば就活時の役に立ってくれると嬉しく思います。

## 使用することで得られる効果・メリット
- メイクをしてこなかった方が、アプリを通じて楽しく生活をより充実させることができる。
- コスメの管理機能で化粧品の状況を把握し、無駄な心配を減らせます。
- 同じ悩みを持った人や解決方法を知っている人と交流し、相談や問題解決ができます。

## 主な機能（抜粋）
1. **パーソナルカラー診断**  
   いくつかの質問に答えることで、自分に似合う色を知ることができます。

2. **コスメ管理機能**  
   自分の持っているコスメの使用期限や在庫管理を把握できます。

3. **タブの追加機能**  
   タイムラインや投稿をパーソナルカラー別に表示するための機能です。

## 今後の計画
特に予定していません。

---

ホーム画面
--------------------------------------------------------------------------------------------
ホームの機能について。以下の4つのことができます。

1.タブの追加(表示したい投稿のみ閲覧できます)

2.各ユーザーの投稿にたいして(いいね・返信・リプライ)が可能です

3.アンケートに投票できる。(他のユーザーの投稿に対して)

4.投稿することができる。(一般投稿・レビュー)

Search画面
--------------------------------------------------------------------------------------------
検索の機能について。以下のことができます。

・表示する投稿の絞り込み(検索したワードが含まれている投稿のみ)が可能です

Profile画面
--------------------------------------------------------------------------------------------
プロフィールの機能について。以下の5つことができます。

1.EditProfileで情報の登録(背景・アイコン・ユーザー名・自己紹介)が可能です。

2.Followに関する(Following・Followers)の確認。また、各ユーザーのProfileの閲覧できる。

3.Postsタブ(自身の投稿のみ閲覧できる)

4.Mediaタブ(自身が投稿した写真の一覧)

5.Likesタブ(自身がいいねした投稿のみ表示される)

Notification画面
--------------------------------------------------------------------------------------------
通知画面について。以下のことができます。

・他ユーザーからいいねやリツイート、またフォローされたときに通知が来ます。

Settings画面　
--------------------------------------------------------------------------------------------
設定の機能について。以下の3つのことができます。

1.AccountInformationでは(ユーザー名・Idの再設定)が可能です。

2.Password(パスワードの再設定・忘れた場合の新規登録)が可能です。

3.Delete Account(アカウントの削除)ができる。

Keep画面
--------------------------------------------------------------------------------------------
保存の機能について。以下のことができます。

・投稿の保存。(他のユーザーの投稿の保持)

Color diagnosis画面
--------------------------------------------------------------------------------------------
以下のことができます。

・パーソナルカラーの診断ができます。（10個！質問に答えると結果が表示されます）

My Cosmetics画面
--------------------------------------------------------------------------------------------
コスメの管理画面の機能について。以下の4つのことができます。

1.タブの追加。

2.検索ができる。

3.Addボタンではコスメの登録(ブランド名・商品名・個数・値段・メモ)が可能。

4.ハートボタンではそのコスメのみの一覧が確認できる。　

----

### ログアウトについて
- ログアウトは画面左側に常に表示されています。クリックするとサインイン画面に移動します。

----

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
