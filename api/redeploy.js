const axios = require('axios');

const redeploy = async () => {
  try {
    const githubToken = process.env.TOKEN;
    const githubRepository = process.env.GITHUB_REPOSITORY; // Substitua pelo seu repositório no formato 'owner/repo'

    console.log(githubRepository);
    // Verifica se o token e o repositório estão definidos
    if (!githubToken || !githubRepository) {
      throw new Error('Token do GitHub ou repositório não estão definidos.');
    }

    // Faz a solicitação POST para o endpoint de dispatches do GitHub
    const response = await axios({
      method: 'post',
      url: `https://api.github.com/repos/${githubRepository}/dispatches`, // URL do endpoint
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${githubToken}`, // Token de autenticação
        'X-GitHub-Api-Version': '2022-11-28', // Versão da API
      },
      data: {
        event_type: 'redeploy', // Tipo de evento
        client_payload: {
          unit: false,
          integration: true,
        },
      },
    });

    console.log('Redeploy acionado com sucesso', response.data);
  } catch (error) {
    console.error(
      'Erro ao acionar o redeploy:',
      error.response ? error.response.data : error.message
    );
  }
};

module.exports = redeploy;
