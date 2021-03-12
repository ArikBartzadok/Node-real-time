const express = require('express')
const path = require('path')

const app = express()
// Definindo protocolo http
const server = require('http').createServer(app)
// Definindo protocolo web-socket
const io = require('socket.io')(server)
// Definindo pasta para arquivos públicos
app.use(express.static(path.join(__dirname, 'public')))
// Definindo a localização dos arquivos estáticos
app.set('views', path.join(__dirname, 'public'))
// Definindo o template engine padrão como html
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
// Definindo as rotas de acesso do sistema
app.use((req, res) => {
    res.render('index.html')
})
// Definindo array para armazenar mensagens (posteriormente, implementar um BD)
let messages = []
// Todas as vezes que um usuário se conecta...
io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`)
    // Enviando todas as mensagens anteriores para usuários que estejam se conectando
    socket.emit('previousMessages', messages)
    // Escutando o evento de envio de mensagens
    socket.on('sendMessage', data => {
        // Armazenando os dados recebidos dentro do array declarado
        messages.push(data)
        // Emitindo para todos os usuários conectados na plataforma os dados das mensagens
        socket.broadcast.emit('receivedMessage', data)
    })
})

// Definindo servidor para rodar na porta 3000
server.listen(3000)