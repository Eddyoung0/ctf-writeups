import { useNavigate } from 'react-router-dom';
import Home from './home';

const PreviewPage = () => {
  const navigate = useNavigate();

  const handlePreviewClick = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const interactiveElement = target.closest('button, a, [role="button"], .cursor-pointer');
    if (!interactiveElement) return;

    event.preventDefault();
    event.stopPropagation();
    navigate('/login');
  };

  return (
    <div onClickCapture={handlePreviewClick}>
      <Home />
    </div>
  );
};

export default PreviewPage;
