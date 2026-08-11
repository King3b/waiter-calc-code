package com.example.waiter_app

import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)

        webView.webViewClient = WebViewClient()

        val settings: WebSettings = webView.settings

        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true

        webView.loadUrl(
            "file:///android_asset/waiter-calculator/pages/waiter_board.html"
        )
    }
}