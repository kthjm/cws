#!/usr/bin/env node

const execa = require('execa')
const path = require('path')

const exec = ({
  base = 'items',
  name,
  input = 'src',
  id
}) => {
  const cmd = 'yarn chenv upload'
  const flag = ' -p'
  const src = `${base}/${name}/${input}`
  const command = `${cmd} ${src}${id ? ` ${id}` : ''}${flag}`
  
  console.log(`chenvs: ${command}`)
  
  const promise = execa.shell(command)
  
  promise.stdout.pipe(process.stdout)
  promise.stderr.pipe(process.stdout)
  return promise.catch(() => {/* just catch */})
}

const { cws } = require(path.join(process.cwd(), 'package.json'))
const { base, items } = cws

const children = Object.entries(items).map(([ name, item ]) => {
  const { input, id } = typeof item === 'object' ? item : { id: item }
  return exec({ base, name, input, id })
})

Promise.all(children)