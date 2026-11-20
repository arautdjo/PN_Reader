// checar por boundaries nas posições certas e sua restrução onde nao deve estar


import {chuncksCode} from '../contantes/contantes_part_number'
// import {dictionary_products} from '../contantes/contantes_part_number'
import {dictionary_products_display} from '../contantes/contantes_part_number'
import {dictionary_colors} from '../contantes/contantes_part_number'
import {dictionary_sizes} from '../contantes/contantes_part_number'
import {dictionary_brands} from '../contantes/contantes_part_number'

let instacia_validacao = null;

export class Validation{
    #partNumber;
    #chuncks = [];
    #segmentos =[];
    #accualldata = [];
    #boundaries = ['hm68','mox2d','fj','ooq'];

    constructor(pn=null){

        if(pn){
            this.#partNumber = pn
        }      
      
        
    }

    getchekPartt(s){
        return this.#chuncks[s]
    }


    validationLength(pn=null){
        
        this.#segmentos = []
        this.#chuncks = []

       if(pn){
          const objvalidator = pn.length === 50 ? true : false
           this.#partNumber = pn
          return objvalidator
       }else if(this.#partNumber){
          const objvalidator = this.#partNumber.length === 50 ? true : false

          return objvalidator
       }
    }


    sliceBoundaries(pn){
        if(!this.#partNumber){
            this.#partNumber = pn
        }

        
         this.#chuncks.push(this.#partNumber.slice(0,4))
         this.#chuncks.push(this.#partNumber.slice(12,17))
         this.#chuncks.push(this.#partNumber.slice(27,29))
         this.#chuncks.push(this.#partNumber.slice(36,39))
         
         return this.matchChunckChar() 
    }

    

    matchChunckChar(){
        
      this.#chuncks.forEach((elemento,inda)=>{
            [...elemento].forEach((el)=>{
               
                if(!chuncksCode.includes(el)){
                    
                   this.#segmentos.push(`erro no segmento ${inda}`)
                }
            })
      })

      if(this.#segmentos.length>0){
           return {
              error:this.#segmentos,
              aprovado:false
           }
      }

      return {
        error:false,
        aprovado:true
      }

    }



    

    extraiValor(){
        const valuesDesc = [];
        const valuesExtracted = []
        this.#accualldata.push(this.#partNumber.slice(4,12))
        this.#accualldata.push(this.#partNumber.slice(17,27))
        this.#accualldata.push(this.#partNumber.slice(29,36))
        this.#accualldata.push(this.#partNumber.slice(39,50))


       const segOne = this.#partNumber.slice(0,4).includes(this.#boundaries[0]) ? this.#partNumber.slice(0,4) : 'indefinido'
       valuesDesc.push(segOne)
       const segTwo = this.#partNumber.slice(12,17).includes(this.#boundaries[1]) ? this.#partNumber.slice(12,17) : 'indefinido'
       valuesDesc.push(segTwo)

       const segThree = this.#partNumber.slice(27,29).includes(this.#boundaries[2]) ? this.#partNumber.slice(27,29) : 'indefinido'
       valuesDesc.push(segThree)
       
       const segFour = this.#partNumber.slice(36,39).includes(this.#boundaries[3]) ?  this.#partNumber.slice(36,39) : 'indefinido'
       valuesDesc.push(segFour)

     

       valuesExtracted.push(valuesDesc)
       valuesExtracted.push(this.#accualldata)

        return valuesExtracted
        
    }
    


    // checkOnDIc(produto){
    //     const recproduct = dictionary_products.filter((cadastro)=>{
    //          if(cadastro.code === produto){
    //              return cadastro
    //          }
    //     })

    //     // const busca = {}
    //     const oQueTem = this.extraiValor()
    //     console.log('aem que pé estamos')
    //     console.log(oQueTem)
    //     console.log('aem que pé estamos')

    //     return recproduct[0]
    // }


    grinding(ara,campo,dado,campoExit){
         const que = ara.filter((elemento)=>{
            if(elemento[String(campo)]===dado){
                
                return elemento[String(campoExit)]
            }
         })

        //  console.log('<-- senhor encrenca -->>')
        //  console.log(que)         
        //  console.log('<-- senhor encrenca -->>')
         if(que.length===0){
            // console.log('TA PROVADO QUE NAO ENTROU')
           return 'Unknown'
         }
         return que[0][String(campoExit)]
    }

    isUnregistered(objota){
        var reprova = {reprovado:false};
        for(const chave in objota){
                // console.log('VE LA EIN')
                // console.log(chave)
                // console.log('VE LA EIN')
               if(objota[chave]==='Unknown'){                
                   reprova.reprovado = true
               }
        }

        return reprova.reprovado
    }
    


    checkOnDIc(){
        // const oQueTem = this.extraiValor()        
        this.extraiValor()        
        
        const retorno_busca = []

        const assembling = {
            product: this.grinding(dictionary_products_display,'code',String(this.#accualldata[0]),'product'),
            cor: this.grinding(dictionary_colors,'codecolor',String(this.#accualldata[1]),'color'),
            size: this.grinding(dictionary_sizes,'sizecode',String(this.#accualldata[2]),'size'),
            brand: this.grinding(dictionary_brands,'codebrand',String(this.#accualldata[3]),'brand'),
        }

        retorno_busca.push(assembling)
        
        // return retorno_busca
        // console.log('-@@@@@@@@@@@@-')
        // console.log(retorno_busca)
        // console.log('-@@@@@@@@@@@@-')

        if(this.isUnregistered(retorno_busca[0])){
            console.log('EI MALUCOOOO')
             return "Unknown"
        }

        return retorno_busca[0]
    }


}


export class ValSigleton{

    constructor(){
        throw new Error("ValSigleton não pode ser instanciada");
    }

    static getInstanceOf(){
        if(instacia_validacao){
             return instacia_validacao
        }
       instacia_validacao =  new Validation()
       return instacia_validacao
    }

}