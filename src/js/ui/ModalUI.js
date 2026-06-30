export class ModalUI{
    constructor(modalElement){
        this.modalElement=modalElement;
    }
    show({title,text}){
        this.modalElement.innerHTML=`
            <div class="modal-overlay">
                <div class="modal">
                    <h2>${title}</h2>
                    <p>${text}</p>
                    <button class="button" data-modal-new-game>Новая игра</button>
                </div>
            </div>
        `;
    }
    hide(){
        this.modalElement.innerHTML='';
    }
    onNewGame(callback){
        this.modalElement.addEventListener('click',(event)=>{
            const button=event.target.closest('[data-modal-new-game]');
            if(!button)return;
            callback();
        });
    }
}