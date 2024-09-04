export class WhatsappOutgoingImage {
    constructor(
        private readonly name: string | undefined,
        private readonly phone: string,
        private readonly identification: string, 
        private readonly message : string,//sera el archivo base64
        private readonly to: string,
        private readonly type: string,
        
    ) {
        
    }
    async sendToApi(): Promise <void> {
        
      try{

      }catch(error){

      }
    

       // console.log(`nombre: ${this.name}, phone: ${this.phone}, identification: ${this.identification}, message: base64 , to: ${this.to}, type: ${this.type}`);
    }
}