# Plano de Ação — Correções e Melhorias do Portfólio

## Bugs e Alterações

- [x] **1. LinkedIn com link quebrado**
  - Verificar o campo `linkedinUrl` que vem da API
  - Garantir que o link redirecione para o link do linkedin cadastrado no admin
  - Adicionada normalização de URL (adiciona `https://` automaticamente se faltar)

- [x] **2. Ícone de e-mail copia o endereço ao clicar**
  - Removido `mailto:` do email
  - Implementado `navigator.clipboard.writeText(email)` ao clicar
  - Feedback visual: ícone muda para ✓ e label muda para "Copiado!" por 2 segundos

- [x] **3. Botão "Enviar mensagem" redireciona para WhatsApp**
  - Ao clicar em "Enviar Mensagem via WhatsApp" abre `https://wa.me/11987278746`
  - Label atualizado para deixar claro que abrirá o WhatsApp

- [x] **4. Seções de Formações e Certificados não aparecem no portfólio**
  - Criado `EducationSection.tsx` seguindo o padrão visual do portfólio
  - Criado `CertificatesSection.tsx` seguindo o padrão visual do portfólio
  - Ambas buscam dados da API (`/api/education` e `/api/certificates`)
  - Tipos `Education` e `Certificate` adicionados em `api.ts`
  - Seções adicionadas ao `Index.tsx` e link "Formação" adicionado na navbar

- [x] **5. Remover botão "Resumo" da navbar**
  - Botão "Resumo" removido do desktop e do menu mobile

- [x] **6. Botão "Ver detalhes" nos projetos deve funcionar igual ao clique no card**
  - Adicionado `onClick={() => setProjetoSelecionado(project)}` ao botão "Ver detalhes"
