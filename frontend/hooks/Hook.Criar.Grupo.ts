
import { useNavigate } from 'react-router-dom';

export const HookCriarGrupo = () => {
  const navigate = useNavigate();

  const navigateToPublic = () => navigate('/create-group/public');
  const navigateToPrivate = () => navigate('/create-group/private');
  const navigateToVip = () => navigate('/create-group/vip');
  const navigateBack = () => navigate('/groups', { replace: true });
  const navigateToFeed = () => navigate('/feed');
  const navigateToMessages = () => navigate('/messages');

  return {
    navigateToPublic,
    navigateToPrivate,
    navigateToVip,
    navigateBack,
    navigateToFeed,
    navigateToMessages,
  };
};

