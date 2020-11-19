import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../modules';
import { openAlertModal, openConfirmModal, closeModal } from '../modules/modal';
import { useCallback } from 'react';

function useModal(){
    const modalState = useSelector((state:RootState) => state.modal);
    const dispatch = useDispatch();

    const onOpenAlertModal = useCallback((data)=>{
        dispatch(openAlertModal(data));
    }, [dispatch]);

    const onOpenConfirmModal = useCallback((data)=>{
        dispatch(openConfirmModal(data));
    }, [dispatch]);

    const onCloseModal = useCallback(()=>{
        dispatch(closeModal());
    }, [dispatch]);

    return {
        modalState,
        onOpenAlertModal,
        onOpenConfirmModal,
        onCloseModal
    }
}

export default useModal;