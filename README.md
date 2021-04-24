# ifpb-ads-cz-egressos

Aplicação para o acompanhamento dos egressos do curso de Análise e Desenvolvimento de Sistemas do IFPB - Campus Cajazeiras

# Configuração das variáveis de ambiente

PORT={Porta em que a aplicação vai rodar}  
  
PG_USERNAME={Usuário do Postgis}  
PG_PASSWORD={Senha do Postgis}  
PG_HOST={Host em que o Postgis está sendo executado}  
PG_PORT={Porta do Postgis}  
PG_NAME={Nome do banco que contém os dados espaciais}  
  
REDIS_HOST={Host em que o Redis está sendo executado}  
REDIS_PORT={Porta do Redis}  
  
MONGO_HOST={Host em que o MongoDB está sendo executado}  
MONGO_PORT={Porta do MongoDB}  
MONGO_DATABASE={Nome do banco que vai armazenar os dados dos estudantes}  

# Dependências

Para instalar as dependências basta rodar o seguinte comando:

```
$ npm i
```

# Executar aplicação

Para executar a aplicação basta rodar o seguinte comando:

```
$ npm start
```