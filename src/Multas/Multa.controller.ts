import { orm } from "../shared/db/orm.js";
import { Request, Response, NextFunction } from "express";
import { Multa } from "./Multa.entity.js";
import { Evidencia } from "../evidencia/evidencia.entity.js"
import { Carpeta } from '../carpeta/carpeta.entity.js';

const em = orm.em

function sanitizeMultasInput(req: Request, res: Response, next: NextFunction) {
  const { motivoMulta, montoMulta, lugarDePago, fechaEmision, estado, fechaVencimiento, evidenciaId } = req.body;

  req.body.sanitizedInput = {
    motivoMulta,
    montoMulta: montoMulta !== undefined ? Number(montoMulta) : undefined,
    lugarDePago,
    fechaEmision,
    estado: estado ?? null,
    fechaVencimiento,
    evidenciaId,
  };

  for (const k of Object.keys(req.body.sanitizedInput)) {
    if (req.body.sanitizedInput[k] === undefined) delete req.body.sanitizedInput[k];
  }
  next();
}


async function findAll(req:Request, res:Response){
    try {
        const multas = await em.find(Multa , {})
        res.status(200).json({message : "find all multas" , data : multas})
    } catch(error : any){
        res.status(500).json({message : error.message})
    }
}


async function findOne(req:Request,res:Response){
    try {
        const id = Number.parseInt(req.params.id)
        const multa = await em.findOneOrFail(Multa, { id })
        res.status(200).json({ message: 'find one multa', data: multa })
      } catch (error: any) {
        res.status(500).json({ message: error.message })
      }
}

async function add(req:Request,res:Response){
    
    try {
        const {
            motivoMulta,
            montoMulta,
            lugarDePago,
            fechaEmision,
            estado,
            fechaVencimiento,
            evidenciaId,
        } = req.body.sanitizedInput;

        const evidencia = await em.findOneOrFail(Evidencia, { id: Number(evidenciaId) });
        const multa = em.create(Multa, {
            motivoMulta,
            montoMulta,
            lugarDePago,
            fechaEmision: new Date(fechaEmision),
            estado: estado ?? null,
            fechaVencimiento: new Date(fechaVencimiento),
            evidencia,
        });

        await em.persistAndFlush(multa);

        const carpeta = await em.findOneOrFail(Carpeta, { id: evidencia.carpeta.id }, { populate: ['burocrata', 'metahumano', 'evidencias', 'evidencias.multas'] });

        return res.status(201).json({
        message: 'Multa creada correctamente',
        data: carpeta,
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

async function update(req:Request,res:Response){
    try {
        const id = Number.parseInt(req.params.id)
        const multaToUpdate = await em.findOneOrFail(Multa, { id })
        em.assign(multaToUpdate, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({ message: 'multa updated', data: multaToUpdate })
      } catch (error: any) {
        res.status(500).json({ message: error.message })
      }
}



async function remove(req:Request,res:Response){
     try {
        const id = Number.parseInt(req.params.id)
        const multa = em.getReference(Multa, id)
        await em.removeAndFlush(multa)
        res.status(200).json({ message: 'multa deleted' })
      } catch (error: any) {
        res.status(500).json({ message: error.message })
      }
}


export{sanitizeMultasInput,findAll,findOne,add,update,remove}