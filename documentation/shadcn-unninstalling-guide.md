## 🛠️ Ручное удаление Shadcn U

1. **Удалите компоненты:**
   Удалите все файлы и папки, связанные с Shadcn UI, обычно находящиеся в `src/components/ui/`.

2. **Удалите зависимости:**
   Проверьте `package.json` на наличие зависимостей, установленных вместе с Shadcn UI, таких как:

   * `@radix-ui/react-*`
   * `lucide-react`
   * `tailwindcss-animate`
   * `class-variance-authority`
   * `clsx`([reddit.com][2])

   Удалите их с помощью:

   ```bash
   npm uninstall <package-name>
   ```



3. **Очистите конфигурационные файлы:**
   Проверьте и удалите любые изменения, связанные с Shadcn UI, в следующих файлах:

   * `tailwind.config.js`
   * `postcss.config.js`
   * `globals.css` или аналогичных([ui.shadcn.com][3])

4. **Проверьте импорты:**
   Убедитесь, что в коде не осталось импортов из удалённых компонентов.

---

## ✅ Заключение

Если вы ищете быстрый и безопасный способ удаления Shadcn UI, рекомендуется использовать `shadcn-remover`. Для более глубокого контроля можно воспользоваться ручным методом.([socket.dev][1])

Дополнительную информацию и обсуждения можно найти в официальной документации и на GitHub:

* [shadcn-remover на npm](https://www.npmjs.com/package/shadcn-remover)
* [Обсуждение на GitHub](https://github.com/shadcn-ui/ui/discussions/7300)([socket.dev][1], [github.com][4])

Если у вас возникнут дополнительные вопросы или потребуется помощь, не стесняйтесь обращаться!

[1]: https://socket.dev/npm/package/shadcn-remover?utm_source=chatgpt.com "shadcn-remover - npm Package Security Analysis - Socket"
[2]: https://www.reddit.com/r/nextjs/comments/1cu461l?utm_source=chatgpt.com "help with next and shadcn"
[3]: https://ui.shadcn.com/docs/react-19?utm_source=chatgpt.com "Next.js 15 + React 19 - shadcn/ui"
[4]: https://github.com/shadcn-ui/ui/discussions/7300?utm_source=chatgpt.com "Introducing: shadcn-remover CLI · shadcn-ui ui · Discussion #7300 · GitHub"
