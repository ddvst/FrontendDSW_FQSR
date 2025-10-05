import { Cascade, Property, Collection, Entity, ManyToOne, OneToMany,  Rel } from '@mikro-orm/core';
import { Metahumano } from '../metahumano/metahumano.entity.js';
import { Burocrata } from '../Burocratas/Burocrata.entity.js';
import { Evidencia } from '../evidencia/evidencia.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Carpeta extends BaseEntity {

   @Property()
   descripcion!: string;   // <- DEBE existir si lo usás en el create

   @Property()
   estado!: string;   // o @Enum si querés

   @Property()
   tipo!: string;

   @ManyToOne(()=>Metahumano,{
      nullable:true
   })
   metahumano!:Rel<Metahumano>
   
   @ManyToOne(()=>Burocrata,{
      nullable : true
   })
   burocrata!:Rel<Burocrata>

   @OneToMany(()=>Evidencia,evidencia => evidencia.carpeta, {
      cascade: [Cascade.ALL],
   })
   evidencias = new Collection<Evidencia>(this)
}