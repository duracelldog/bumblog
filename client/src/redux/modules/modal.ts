const OPEN_ALERT = 'modal/open' as const;
const OPEN_CONFIRM = 'modal/open_confirm' as const;
const CLOSE = 'modal/close' as const;


export type ModalDataType = {
    status: boolean;
    title: string;
    desc: string;
    confirm: {
        isShow: boolean;
        func?: () => void;
    };
}

export const openAlertModal = (data: ModalDataType) =>({
    type: OPEN_ALERT,
    payload: {
        title: data.title,
        desc: data.desc,
        confirm: {
            isShow: false
        }
    }

});

export const openConfirmModal = (data: ModalDataType) =>({
    type: OPEN_CONFIRM,
    payload: {
        title: data.title,
        desc: data.desc,
        confirm: {
            isShow: data.confirm.isShow,
            func: data.confirm.func
        }
    }
});

export const closeModal = () =>({
    type: CLOSE
})

type ModalAction = 
    | ReturnType<typeof openAlertModal>
    | ReturnType<typeof openConfirmModal>
    | ReturnType<typeof closeModal>

const initialState: ModalDataType = {
    status: false,
    title: '',
    desc: '',
    confirm: {
        isShow: false,
        func: () => {}
    }
}

function modal(state: ModalDataType = initialState, action: ModalAction): ModalDataType{
    switch(action.type){
        case OPEN_ALERT:
            return {
                status: true, 
                title: action.payload.title,
                desc: action.payload.desc,
                confirm: {
                    isShow: action.payload.confirm.isShow,
                }
            }
        case OPEN_CONFIRM:
            return {
                status: true, 
                title: action.payload.title,
                desc: action.payload.desc,
                confirm: {
                    isShow: action.payload.confirm.isShow,
                    func: action.payload.confirm.func
                }
            }
        case CLOSE:
            return {
                ...state,
                status: false
            }
        default:
            return state;
    }
}

export default modal;