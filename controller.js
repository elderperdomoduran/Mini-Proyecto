import { pool } from './database.js'
import path from 'node:path'
import fs from 'node:fs/promises'

export async function index (response) {
  const ruta = path.resolve('./portada.html')
  const contenido = await fs.readFile(ruta, 'utf-8')

  response.writeHead(200, { 'Content-Type': 'text/html' })
  response.end(contenido)
}
export async function getUsuarios (response) {
  const resultado = await pool.query('SELECT * FROM usuarios')
  const data = resultado[0]
  const dataString = JSON.stringify(data)

  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(dataString)
}
export async function saveToFile (response) {
  try {
    const resultado = await pool.query('SELECT * FROM usuarios')
    const usuarios = resultado[0]

    const cabeceras = Object.keys(usuarios[0])
    const stringCabeceras = cabeceras.join(',')
    const stringUsuarios = usuarios.reduce((acc, usuario) => acc + `${usuario.Id}, ${usuario.Nombres}, ${usuario.Apellidos}, ${usuario.direccion} 
    ${usuario.correo}, ${usuario.dni}, ${usuario.edad}, ${usuario.fecha_creacion}, ${usuario.telefono}\n`, '')

    await fs.writeFile('usuarios.txt', stringCabeceras + stringUsuarios)

    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ message: 'Usuarios exportados' }))
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ message: 'Hubo un error interno' }))
  }
}
export async function importFromFile (response) {
  try {
    const ruta = path.resolve('./usuarios.txt')
    const contenido = await fs.readFile(ruta, 'utf-8')

    const filas = contenido.split('\n')
    const filasFiltradas = filas.filter(fila => fila !== '')
    filasFiltradas.shift()

    for (const fila of filasFiltradas) {
      const columnas = fila.split(',')
      const [id,nombres,apellidos,dirección,correo,dni,edad,fecha_creacion,telefono] = columnas
      await pool.execute('INSERT INTO usuarios (id,nombres,apellidos,dirección,correo,dni,edad,fecha_creacion,telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id,nombres,apellidos,dirección,correo,dni,edad,fecha_creacion,telefono])
    }
    
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ message: 'Usuarios importados' }))

    console.log('Datos importados exitosamente')
  } catch (error) {
    console.error('Error al importar datos:', error)
  }
}
