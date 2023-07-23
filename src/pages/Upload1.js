import UploadForm1 from "../components/UploadForm1"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



const Upload1 = () => {

  return (
    <section className="upload" id="upload1">

      <Container>
        <Row>
          <Col></Col>
          <Col>
            <UploadForm1 className="upload-form" />
          </Col>
          <Col></Col>
        </Row>
      </Container>


    </section>
  )

}
export default Upload1;


