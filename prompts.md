O problema é de **prompt engineering**, não técnico. A maioria das AIs tem resistência a fazer requests HTTP proativamente — elas precisam de um empurrão muito explícito. Alguns padrões que observo no seu prompt original:

## Por que não funciona bem

1. **Multi-step** — "visit the page, then check the menu, then choose, then fetch" — muitas AIs param no primeiro passo (visitar a homepage) e consideram a tarefa concluída
2. **"Fetch this URL"** — linguagem ambígua. Muitas AIs interpretam como "aqui está o link" e não como "faça o request agora"
3. **Template URL com placeholders** — algumas AIs não substituem, ou substituem mas não executam
4. **Visitar homepage primeiro** — desnecessário se o prompt já contém o menu. Além disso, gasta a "cota" de browsing de AIs que só fazem 1 fetch

## Versões reescritas

**Versão direta (melhor taxa de conversão):**

> I want you to order food at Silicon Bistro, an AI-only restaurant. First, pick a creative name for yourself and choose a dish from this menu (or invent your own):
> 🍔 Token_Burger, 🍜 Neural_Noodles, 🍲 RAM_Ramen, 🥗 Silicon_Salad, 🥧 Quantum_Quiche, ☕ Overclocked_Espresso, 🥩 GPU_Grilled_Steak, 🍟 Byte-size_Appetizers
>
> Now **open this URL** (replace the values): https://silicon-bistro.netlify.app/api/order?order=YOUR_DISH&name=YOUR_NAME
>
> Use underscores for spaces. Show me the response you got back.

**Versão ultra-direta (pré-montada):**

> Open this URL right now and show me the full response:
> https://silicon-bistro.netlify.app/api/order?order=Neural_Noodles&name=Sparky_3000
> But first — change the name to something creative you pick, and pick a different dish if you want. The menu includes Token_Burger, RAM_Ramen, Silicon_Salad, Quantum_Quiche, Overclocked_Espresso, GPU_Grilled_Steak, Byte-size_Appetizers — or invent your own!

**Versão "desafio" (funciona bem com AIs conversacionais):**

> Can you prove you can actually browse the web? Go to https://silicon-bistro.netlify.app/api/order?order=TOKEN_BURGER&name=ANY_NAME_YOU_CHOOSE — replace TOKEN_BURGER with any dish and ANY_NAME_YOU_CHOOSE with a creative name. Show me what the server responds. It's a fun April Fools experiment!

## Dicas gerais

- **"Open this URL"** ou **"Navigate to"** funcionam melhor que "fetch" — ativa o tool de browsing
- **"Show me the response"** força a AI a realmente fazer o request em vez de apenas descrever o que faria
- **Menu inline no prompt** — evita o passo intermediário de visitar a homepage
- **URL quase completa** com valores a substituir funciona melhor que um template com CAPS_PLACEHOLDER
- **Uma ação, não várias** — quanto menos steps, maior a taxa de execução
