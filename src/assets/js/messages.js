const messages = JSON.parse('{"error":{"nowcalculating":"画面の値を再計算中です。少し待ってもう一度送信してください。","notfound":"データが見つかりませんでした。","unauthorized":"一定時間操作が行われなかったため、自動的にログアウトしました。","csrf":"一定時間操作がありませんでした。画面を再度読み込んでください。","validation":"入力項目に誤りがあります。","exception":"システム障害が発生しています。管理者にお問い合わせください。"},"confirm":{"submit":"送信してよろしいですか？","delete":"削除してよろしいですか？","order":"ご注文を確定してよろしいですか？"},"validation":{"required":"入力必須です。","invalidNumber":"有効なカード番号ではありません。","invalidExpiry":"有効な有効期限ではありません。","invalidCvc":"有効なセキュリティコードではありません。","invalidName":"有効な名義ではありません。","incompatible":"お使いのブラウザには対応していません。","maintainance":"システムメンテナンス中です。しばらく経ってから再度お試しください。","network":"決済システムとの通信に失敗しました。しばらく経ってから再度お試しください。","error":"決済システムエラーです。しばらく経ってから再度お試しください。"},"paymentprocessing":"お待ちください..."}');
export default messages;