

const puppeteer = require('puppeteer');
const fs = require('fs');


    // Gerencia abertura do navegador
(async () => {
    const browser = await puppeteer.launch({headless: false});
    const mainPage = await browser.newPage();
    await mainPage.goto("https://www.diariomunicipal.sc.gov.br/site/?r=site/index&q=nomear+-cedro+entidade%3A%22C%C3%A2mara+de+Vereadores+de+S%C3%A3o+Jos%C3%A9%22")
    //let allPages = await browser.pages(); //array com todas as guia

    //Tratando o total de Resultados encontrados:
    const results = await mainPage.evaluate(()=> {   
        return {
            totalResults:  document.querySelector("#content > div:nth-child(5) > div.span8 > p").innerHTML,
    }});
    let resultsTxt = JSON.stringify(results); //Transforma o OBJ "results" em string
    resultsTxt = resultsTxt.substring(34, 38) //.substring(posiçãoInicial, posFinal) >> Pega um trecho especifico da string 
    resultsInt = parseInt(resultsTxt, 10)
    x = 0

    //Total de paginas para fazer o loop correto
    let numPages = resultsTxt/10
    numPages = Math.trunc(numPages)
    
    function Portaria(codigo, entidade, dataPublicacao, titulo){
        this.codigo = codigo;
        this.entidade = entidade;
        this.dataPublicacao = dataPublicacao;
        this.titulo = titulo;
    }
    const portarias = [];
    for(actualPage = 1; actualPage <= numPages; actualPage++)   {
        console.log(`Scraping page number: ${actualPage}`);
        
        for (x = 3; x < 104; x += 11) {
            await mainPage.waitForTimeout(2000);
            console.log(x)
            await mainPage.click(`#content > div:nth-child(7) > a:nth-child(${x})`);
            let allPages = await browser.pages();
            allPages[2].bringToFront();
            await allPages[2].waitForTimeout(2000);
            let pageContent = await allPages[2].evaluate(()=>{
                return [codigo, entidade, dataPublicacao, titulo] = [
                    document.querySelector("#yw0 > tbody > tr:nth-child(1) > td").innerHTML,
                    document.querySelector("#yw0 > tbody > tr:nth-child(4) > td").innerHTML,
                    document.querySelector("#yw0 > tbody > tr:nth-child(6) > td").innerHTML,
                    document.querySelector("#yw0 > tbody > tr:nth-child(8) > td").innerHTML,     
                ]})
            // destructuring, passando variaveis para assumirem valores respectivos ao array pageContent
            const [codigo, entidade, dataPublicacao, titulo] = pageContent;
            console.log(codigo, entidade, dataPublicacao, titulo)
            portarias.push(new Portaria(codigo, entidade, dataPublicacao, titulo))
            console.log(portarias);
            allPages[2].close();
        };
        await mainPage.click("#yw4 > li.next > a");
        fs.writeFileSync("portarias.json", JSON.stringify(portarias, null, 2))
    }         
})();