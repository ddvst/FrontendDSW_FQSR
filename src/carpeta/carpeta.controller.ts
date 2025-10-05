import { Request, Response, } from "express";
import { Carpeta } from "./carpeta.entity.js";
import { Metahumano } from '../metahumano/metahumano.entity.js';
import { Burocrata } from '../Burocratas/Burocrata.entity.js';
import { Evidencia } from '../evidencia/evidencia.entity.js';
import { orm } from "../shared/db/orm.js";

const em = orm.em



async function findAll(req:Request, res:Response){
  try {
    const carpetas = await em.find(Carpeta, {}, { populate: ['burocrata', 'metahumano', 'evidencias'] });
    res.status(200).json({message : 'find All carpetas', data: carpetas})
    } catch (error : any) {
      res.status(500).json({error:error.message})  
    }
}

async function findOne(req:Request, res: Response){
  try {
    const id = Number.parseInt(req.params.id)
    const carpeta = await em.findOne(Carpeta, { id }, {
      populate: ['burocrata', 'metahumano', 'evidencias', 'evidencias.multas'],
    });    
    res.status(200).json({message: 'found one carpeta', data : carpeta})
  } catch (error : any) {
    res.status(500).json({error:error.message})
  }
}

async function add(req: Request, res: Response) {
  const em = orm.em.fork();

  try {
    const burocrataId = Number(req.body.burocrataId);
    const metahumanoId = Number(req.body.metahumanoId);
    const { descripcion, estado, tipo, evidencias } = req.body;

    const carpeta = em.create(Carpeta, {
      descripcion,
      estado,
      tipo,
      burocrata: em.getReference(Burocrata, burocrataId),
      metahumano: em.getReference(Metahumano, metahumanoId),
    });

    if (Array.isArray(evidencias)) {
      for (const ev of evidencias) {
        const evidencia = em.create(Evidencia, { ...ev, carpeta }); 
        carpeta.evidencias.add(evidencia);
      }
    }

    await em.persistAndFlush(carpeta);

    return res.status(201).json({
      message: 'Carpeta creada',
      data: carpeta,
    });

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}




async function remove(req:Request, res:Response){
  try {
    const id = Number.parseInt(req.params.id)
    const carpetaToDelete = em.getReference(Carpeta,  id )
    await em.removeAndFlush(carpetaToDelete)
    res.status(200).json({message : 'Carpeta has been eliminated' })
  } catch (error : any) {
    res.status(500).json({error:error.message})
  }
}


export {findOne, findAll, remove, add}

  