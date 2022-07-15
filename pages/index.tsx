import { useEffect, useState } from 'react';
import Questionario from '../components/Questionario';
import QuestaoModel from '../model/questao';
import { useRouter } from '../node_modules/next/router';

const BASE_URL =
    'https://quiz-app-com-next-e-react-anderecc-anderecc.vercel.app/api';

export default function Home() {
    const router = useRouter();

    const [idsDasQuestoes, setIdsDasQuestoes] = useState<number[]>([]);
    const [questao, setQuestao] = useState<QuestaoModel>();
    const [respostasCertas, setRespostasCertas] = useState<number>(0);

    async function carregarIdsQuestoes() {
        const resp = await fetch(`${BASE_URL}/questionario`);
        const idsDasQuestoes = await resp.json();
        setIdsDasQuestoes(idsDasQuestoes);
    }
    async function carregarQuestao(idQuestao: number) {
        const resp = await fetch(`${BASE_URL}/questoes/${idQuestao}`);
        const obj = await resp.json();
        const novaQuestao = QuestaoModel.criarUsandoObjeto(obj);
        setQuestao(novaQuestao);
    }

    useEffect(() => {
        carregarIdsQuestoes();
    }, []);
    useEffect(() => {
        idsDasQuestoes.length > 0 && carregarQuestao(idsDasQuestoes[0]);
    }, [idsDasQuestoes]);

    function questaoRespondida(questaoRespondida: QuestaoModel) {
        setQuestao(questaoRespondida);
        const acertou = questaoRespondida.acertou;
        setRespostasCertas(respostasCertas + (acertou ? 1 : 0));
    }

    function idProximaPergunta() {
        const proximoIndice = idsDasQuestoes.indexOf(questao.id) + 1;
        return idsDasQuestoes[proximoIndice];
    }

    function irProximoPasso() {
        const proximoId = idProximaPergunta();
        proximoId ? irProximaQuestao(proximoId) : finalizar();
    }

    function irProximaQuestao(proximoId: number) {
        carregarQuestao(proximoId);
    }
    function finalizar() {
        router.push({
            pathname: '/resultado',
            query: {
                total: idsDasQuestoes.length,
                certas: respostasCertas,
            },
        });
    }

    return questao ? (
        <Questionario
            questao={questao}
            ultima={idProximaPergunta() === undefined}
            questaoRespondida={questaoRespondida}
            irProximoPasso={irProximoPasso}
        />
    ) : (
        false
    );
}
