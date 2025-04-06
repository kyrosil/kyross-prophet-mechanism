/* Genel sayfa stilleri */
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f6; color: #333; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; box-sizing: border-box; }
/* Başlangıç Ekranı Stilleri */
#start-screen { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 30px 40px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.08); max-width: 750px; width: 95%; box-sizing: border-box; margin-top: 2vh; }
#start-screen h2 { color: #2c3e50; margin-bottom: 25px; font-weight: 600; }
#start-screen #main-logo { max-width: 160px; height: auto; margin-bottom: 30px; }
#start-screen .intro-text { margin-bottom: 30px; line-height: 1.7; font-size: 1.15em; color: #34495e; }
#start-screen .intro-text em { display: block; font-size: 0.9em; opacity: 0.75; margin-top: 8px; color: #7f8c8d; }
#start-screen .sponsor-logos { display: flex; justify-content: center; align-items: center; gap: 30px; margin-bottom: 35px; flex-wrap: wrap; border-top: 1px solid #eee; padding-top: 25px; width: 100%; }
#start-screen .sponsor-logos img { max-height: 45px; max-width: 110px; height: auto; width: auto; filter: grayscale(50%); opacity: 0.8; transition: filter 0.3s ease, opacity 0.3s ease; }
#start-screen .sponsor-logos img:hover { filter: grayscale(0%); opacity: 1; }
#start-game-button { padding: 12px 25px; font-size: 1.1em; line-height: 1.4; cursor: pointer; background-color: #3498db; color: white; border: none; border-radius: 6px; transition: background-color 0.2s ease, transform 0.1s ease; font-weight: 500; white-space: normal; max-width: 250px; }
#start-game-button:hover { background-color: #2980b9; }
#start-game-button:active { transform: scale(0.98); }
/* Ana Oyun Alanı */
#main-title { display: none; color: #2c3e50; text-align: center; margin-top: 30px; margin-bottom: 15px; font-weight: 600; }
#mechanism { display: none; background-color: #ffffff; border: 1px solid #dce4e8; padding: 30px; margin-top: 20px; width: 95%; max-width: 650px; min-height: auto; box-shadow: 0 5px 15px rgba(0,0,0,0.05); text-align: center; box-sizing: border-box; border-radius: 8px; }
/* Seviye 1 Stilleri */
#mechanism h2 { margin-top: 0; margin-bottom: 15px; color: #2c3e50; font-weight: 600; }
#mechanism-symbols { margin-top: 15px; margin-bottom: 20px; padding: 10px 0; text-align: center; }
#mechanism-symbols button { font-size: 2em; padding: 10px 20px; cursor: pointer; border: 2px solid #bdc3c7; background-color: #ecf0f1; color: #34495e; border-radius: 6px; min-width: 60px; text-align: center; transition: background-color 0.2s, transform 0.1s; margin: 5px; position: relative; z-index: 10; display: inline-block; }
#mechanism-symbols button:hover { background-color: #d1d5d8; }
#mechanism-symbols button:active { transform: scale(0.96); }
#indicator { width: 100px; height: 100px; border: 3px solid #bdc3c7; background-color: #dde4e6; margin: 15px auto 20px auto; transition: background-color 0.4s; border-radius: 8px; box-shadow: inset 0 2px 5px rgba(0,0,0,0.1); }
#mechanism > p { margin-top: 15px; font-size: 1em; color: #7f8c8d; }
/* Seviye 2 ve Ödül Stilleri */
.level2-instructions, .reward-instructions { font-size: 1.05em; margin-bottom: 15px; color: #34495e; line-height: 1.5; }
.reward-instructions strong { color: #e74c3c; }
.reward-instructions span { font-size:0.9em; opacity:0.8; color: #7f8c8d; }
.available-letters { font-size: 0.9em; color: #7f8c8d; margin-bottom: 20px; font-family: monospace; letter-spacing: 1.5px; background-color: #f8f9f9; padding: 8px; border-radius: 4px; border: 1px solid #eee; display: inline-block; }
#level2-feedback { font-family: 'Courier New', Courier, monospace; font-size: 1.6em; letter-spacing: 4px; margin-bottom: 20px; padding: 10px 12px; border: 1px dashed #a5b1b8; background-color: #f8f9f9; min-height: 40px; display: inline-block; border-radius: 4px; color: #34495e; word-break: break-all; }
#level2-answer-input { font-size: 1.1em; padding: 10px 12px; margin-right: 10px; margin-bottom: 10px; width: 65%; max-width: 300px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; transition: border-color 0.2s; vertical-align: middle; }
#level2-answer-input:focus { border-color: #3498db; outline: none; }
#level2-answer-submit { font-size: 1.05em; padding: 11px 18px; cursor: pointer; background-color: #3498db; color: white; border: none; border-radius: 4px; transition: background-color 0.2s; vertical-align: middle; }
#level2-answer-submit:hover { background-color: #0056b3; }
#level2-message, #reward-message { margin-top: 15px; min-height: 1.3em; font-weight: bold; color: #e74c3c; font-size: 0.95em; }
#discount-code-area { margin-top: 20px; text-align: left; font-weight: normal; font-size: 1em; display: none; border: 1px solid #2ecc71; padding: 20px; background-color: #eafaf1; line-height: 1.7; border-radius: 6px; }
#discount-code-area h3 { margin-top: 0; margin-bottom: 10px; color: #27ae60; font-weight: 600; border-bottom: 1px solid #abd9b3; padding-bottom: 8px; }
#discount-code-area p { margin: 8px 0; }
#discount-code-area hr { margin: 18px 0; border: none; border-top: 1px dashed #a2d4ad; }
#discount-code-area strong { font-weight: 600; }
#discount-code-area strong[style*="color:blue"], #discount-code-area strong[style*="color:red"] { padding: 2px 5px; background-color: #fff; border-radius: 3px; font-size: 1.15em; font-family: monospace; }
label[for="swiss-email"], label[for="thy-email"] { display: block; margin-bottom: 4px; text-align: left; font-weight: 500; color: #555; font-size: 0.95em; }
#swiss-email, #thy-email { margin-bottom: 12px; width: 100%; padding: 8px; font-size: 1em; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
#get-code-button { margin-top: 20px; padding: 10px 20px; font-size: 1.05em; line-height: 1.3; white-space: normal; max-width: 280px; cursor: pointer; background-color: #28a745; color: white; border: none; border-radius: 5px; transition: background-color 0.2s ease, transform 0.1s ease; }
#get-code-button:hover { background-color: #218838; }
#get-code-button:active { transform: scale(0.98); }
/* Disabled state styles */
#level2-answer-input:disabled, #level2-answer-submit:disabled, #swiss-email:disabled, #thy-email:disabled, #get-code-button:disabled { background-color: #f0f0f0; cursor: not-allowed; opacity: 0.7; }
/* No reset button needed in stateless version */
