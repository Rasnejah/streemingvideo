import file from 'fs'


function getFile(filename) {
  console.log(filename)
    /*
    if(!this.existFile()){
      return 'Arquivo não existente'
    }
    const accountJSON = file.readFileSync(`app/accounts/${this.fileName}`, {
                            encoding: 'utf8',
                            flag: 'r'
                          })

    return JSON.parse(accountJSON)

  }
  */
}

function writeFile(path, data){
  console.log(path, data)
  /*
  file.writeFileSync(path, JSON.stringify(data), function (err) {
    console.log(err)
  })
  */
}

export default upload = {
  "getFile": getFile,
  "writeFile": writeFile
}
