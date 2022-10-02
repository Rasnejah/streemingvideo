
// import dos arquivos
import express from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import {fileURLToPath} from 'url'

// buscando o arquivos

// escrever o arquivo de apouadList
function writeFile(data){
  // verifica se existe o diretorio - se não existir cria-o
  if(!fs.existsSync('public/uploaded')){
    fs.mkdirSync('public/uploaded')
  }

  fs.writeFileSync(`public/uploaded/uploadList.json`, JSON.stringify(data), function (err) {
    console.log(err)
  })
  }

function getFile() {

  const accountJSON = fs.readFileSync(`public/uploaded/uploadList.json`, {
                          encoding: 'utf8',
                          flag: 'r'
                        })

  return JSON.parse(accountJSON)

}

//  configuração do __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// configuração do multer
const storage = multer.diskStorage({
  destination:(req,file, cb)=>{
    cb(null, 'public/videos/')
  },
  filename: (req,file, cb)=>{
    cb(null,file.originalname.replace(/ /g, "_"))
  }
})
const uploads = multer({ storage })


// configuraçẽs
const app = express()

app.set('view engine', 'ejs')
app.use('/app',express.static(path.join(__dirname,'public')))

// rota principal
app.get('/', (req, res)=>{
  let videos = getFile()
  let video = videos[1]
  res.render('index.ejs', {videos} )
})

// rota de upload
app.get('/upload',uploads.single('filetoupload'), (req, res)=>{
  res.render('upload.ejs')
})

app.post('/upload', uploads.single('filetoupload'), (req, res) => {
  let videoName = {video : req.file.filename}
  let videos = getFile()
  videos.push(videoName)

  writeFile(videos)
  //console.log(req.body, req.file)

  res.redirect('/')
})

// rota responsavel para informar o video
app.get("/:assistir", (req, res) =>{
  const video = req.params.assistir
  res.render('video.ejs', { video })
})


// rota para assistir o video
app.get('/video/:video?', (req, res) =>{
  const range = req.headers.range

  if (!range) {
    res.status(400).send("Requires Range Header")
  }

  const video = req.params.video
  console.log(video, range)
  const videoPath = `public/videos/${video}`
  const videoSize = fs.statSync(videoPath).size
  const CHUNK_SIZE = 10 ** 6 // 1MB
  const start = Number(range.replace(/\D/g, ""))
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
  const contentLength = end - start + 1


  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  }

  res.writeHead(206, headers)
  const videoStream = fs.createReadStream(videoPath, { start, end })

  videoStream.pipe(res)
})

app.listen(3000)
