
import { Router } from 'express';
import controleGrupos from '../controles/Controles.Grupos.js';

const rotasGrupos = Router();

rotasGrupos.post('/', controleGrupos.criarGrupo);
rotasGrupos.get('/', controleGrupos.obterGrupos);

export default rotasGrupos;
