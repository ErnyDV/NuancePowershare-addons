// ==UserScript==
// @name         Powershare Addons
// @namespace    http://tampermonkey.net/
// @version      2024-12-27
// @description  Add some functionality to powershare
// @author       https://github.com/ErnyDV
// @match        https://www1.nuancepowershare.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let pagelinks = {
        advancedImagesSearch : 'https://www1.nuancepowershare.com/smr/work/search/showSearch.action',
        pacs : ['https://www1.nuancepowershare.com/smr/work/pacs/view.action', 'https://www1.nuancepowershare.com/smr/work/pacs/view.action#'],
    }

    function capitalizeName(name) {
        return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }

    function sortAndPrintBannerInfo() {
        const names = document.querySelectorAll('.bannerName');
        const dobs = document.querySelectorAll('.bannerDOB');
        const bannerInfo = {};

        names.forEach((nameElement, index) => {
            const name = nameElement.textContent.trim().toLocaleLowerCase();
            const dob = dobs[index].textContent.trim();

            if (bannerInfo[name]) {
                bannerInfo[name].exams += 1;
            } else {
                bannerInfo[name] = { dob: dob, exams: 1 }; 
            }
        });

        const sortedNames = Object.keys(bannerInfo).sort();

        const printWindow = window.open('', '_blank');

        let printContent = `
            <html>
                <head>
                    <title>Nominations</title>
                    <style>
                        body {
                            font-family: sans-serif;
                            font-size: 0.9rem;
                            margin: 0;
                            padding: 20px;
                            text-align: center;  
                        }
                        table {
                            border-collapse: collapse;
                            width: auto;  
                            max-width: 90%; 
                            margin: 0 auto;  
                            text-align: center;  
                        }
                        th, td {
                            border: 1px solid #ccc;
                            padding: 6px 8px;  
                            text-align: center;  
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                        tbody tr:nth-child(even) {
                            background-color: #f9f9f9;
                        }

                        /* Print-specific styles */
                        @media print {
                            body {
                                margin: 0;
                                padding: 0;
                            }
                            table {
                                width: auto;  
                                max-width: 100%;  
                            }
                            th, td {
                                width: auto;
                                border: 1px solid #000;
                                padding: 6px 8px;
                                text-align: center;  
                                white-space: nowrap;  
                                overflow: hidden;  
                                text-overflow: ellipsis;  
                            }
                            th {
                                background-color: #f0f0f0;
                            }
                            button.print-btn {
                                display: none; 
                            }
                        }
                    </style>
                </head>
                <body>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>DOB</th>
                                <th>Exams</th>
                            </tr>
                        </thead>
                        <tbody>`;

        sortedNames.forEach(name => {
            const dob = bannerInfo[name].dob;
            const exams = bannerInfo[name].exams;
            const capitalizedName = capitalizeName(name); 
            printContent += `
                <tr>
                    <td>${capitalizedName}</td>
                    <td>${dob}</td>
                    <td>${exams}</td>
                </tr>`;
        });

        printContent += `
                        </tbody>
                    </table>
                    <button class="print-btn" onclick="window.print(); window.close();">Print</button>
                </body>
            </html>`;

        printWindow.document.write(printContent);
        printWindow.document.close();
    }

    function selectAllLink() {

        let actions = document.getElementById('defaultList');
        let newLi = document.createElement('li')
        let newLink = document.createElement('a');
        newLink.textContent = 'Select All'
        newLink.id = 'selectallLink'
        newLink.style.cursor = 'pointer'
        actions.appendChild(newLi);
        newLi.appendChild(newLink)

        let selectAll = document.getElementById('selectallLink');
        selectAll.addEventListener('click', function(){
            let pacsTableInputs = document.getElementById('pacs-table').querySelectorAll('input')
            pacsTableInputs.forEach(input => {
                input.click()
            });
        })
    }
    

    let currentTabOpen = document.documentURI;

    if(currentTabOpen === pagelinks.pacs[0] || currentTabOpen === pagelinks.pacs[1]) {
                        
        selectAllLink()


        
    }else if (currentTabOpen === pagelinks.advancedImagesSearch) { //Allow typing for the date of birth section
        let searchValue3 = document.getElementById('searchValue3')
        searchValue3.addEventListener('click', function(){
            searchValue3.readOnly = false;
        })
    }else {
        let btnBlock = document.querySelector('#btnBlock');
        let printBtn = document.createElement('a');
        printBtn.classList.add('btn', 'btn-primary');
        printBtn.style.marginLeft = '600px'
        printBtn.textContent = 'Print'

        if(btnBlock){
            btnBlock.appendChild(printBtn)
        }

        printBtn.addEventListener('click', function(){
            sortAndPrintBannerInfo()
        })
    }

})();


