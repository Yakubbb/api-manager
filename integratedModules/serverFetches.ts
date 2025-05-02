'use server'


export async function getFetch(adress: string){
    const resp = await fetch(adress)
    const body = await resp.json()
    console.log(body)
    return body
}