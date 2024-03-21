import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

type Props = {
  text: string;
  title:string;
  onDelete: () => void;
}

const DeleteBtnWithConfirmationModal = ({ text, onDelete,title }: Props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleDelete = () => {
    onDelete(); // Call the onDelete function passed from the parent
    setShow(false); // Close the modal after deletion
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <Button className='btn btn-outline-danger' variant="" onClick={handleShow}>
        Delete
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{text}</Modal.Body>
        <Modal.Footer>
          <Button variant="" className='btn btn-outline-danger' onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="" className='btn btn-outline-primary' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteBtnWithConfirmationModal;
