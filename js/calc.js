document.addEventListener('DOMContentLoaded', function () {

    var categories = {
        dairy:         { name: 'Молочная продукция',           reg: 3000, code: 0.04, report: 7000 },
        meat:          { name: 'Мясные изделия',               reg: 3000, code: 0.05, report: 8000 },
        water:         { name: 'Упакованная вода',             reg: 3000, code: 0.03, report: 5000 },
        beer:          { name: 'Пиво и слабоалкогольные',       reg: 3000, code: 0.05, report: 8000 },
        tobacco:       { name: 'Табак',                        reg: 3000, code: 0.06, report: 10000 },
        caviar:        { name: 'Морепродукты (икра)',          reg: 3000, code: 0.08, report: 10000 },
        oil:           { name: 'Растительные масла',           reg: 3000, code: 0.04, report: 6000 },
        pet_food:      { name: 'Корма для животных',           reg: 3000, code: 0.04, report: 6000 },
        canned:        { name: 'Консервированные продукты',    reg: 3000, code: 0.04, report: 6000 },
        grocery:       { name: 'Бакалея',                      reg: 3000, code: 0.04, report: 6000 },
        beverages:     { name: 'Безалкогольные напитки',        reg: 3000, code: 0.04, report: 6000 },
        sweets:        { name: 'Сладости',                     reg: 3000, code: 0.04, report: 6000 },
        groceries:     { name: 'Макароны, крупы, мёд',         reg: 3000, code: 0.04, report: 6000 },
        medicines:     { name: 'Лекарства',                    reg: 3000, code: 0.10, report: 15000 },
        medical:       { name: 'Медицинские изделия',          reg: 3000, code: 0.08, report: 12000 },
        bad:           { name: 'БАД',                          reg: 3000, code: 0.06, report: 8000 },
        vet:           { name: 'Ветеринарные препараты',        reg: 3000, code: 0.06, report: 8000 },
        sportpit:      { name: 'Спортивное питание',           reg: 3000, code: 0.05, report: 7000 },
        perfume:       { name: 'Духи и туалетная вода',        reg: 3000, code: 0.06, report: 8000 },
        cosmetics:     { name: 'Косметика и бытовая химия',    reg: 3000, code: 0.05, report: 7000 },
        footwear:      { name: 'Обувь',                        reg: 3000, code: 0.05, report: 8000 },
        light_industry:{ name: 'Товары лёгкой промышленности', reg: 3000, code: 0.05, report: 8000 },
        fur:           { name: 'Меховые изделия',              reg: 3000, code: 0.06, report: 10000 },
        toys:          { name: 'Детские игрушки',              reg: 3000, code: 0.05, report: 7000 },
        bicycles:      { name: 'Велосипеды',                   reg: 3000, code: 0.05, report: 7000 },
        tyres:         { name: 'Шины и покрышки',              reg: 3000, code: 0.05, report: 7000 },
        autofluids:    { name: 'Моторные масла',               reg: 3000, code: 0.05, report: 7000 },
        radio:         { name: 'Радиоэлектроника',             reg: 3000, code: 0.07, report: 10000 },
        cameras:       { name: 'Фотоаппараты',                 reg: 3000, code: 0.06, report: 8000 },
        cement:        { name: 'Строительные материалы',       reg: 3000, code: 0.04, report: 6000 }
    };

    var calcCategory = document.getElementById('calcCategory');
    var calcQuantity = document.getElementById('calcQuantity');
    var calcQuantityInput = document.getElementById('calcQuantityInput');
    var calcButton = document.getElementById('calcButton');
    var calcResult = document.getElementById('calcResult');
    var calcDownload = document.getElementById('calcDownload');

    var serviceRadios = document.querySelectorAll('input[name="service"]');

    calcQuantity.addEventListener('input', function () {
        calcQuantityInput.value = this.value;
    });

    calcQuantityInput.addEventListener('input', function () {
        var val = parseInt(this.value) || 100;
        if (val < 100) val = 100;
        if (val > 100000) val = 100000;
        calcQuantity.value = val;
    });

    function formatNumber(n) {
        return n.toLocaleString('ru-RU');
    }

    function calculate() {
        var catKey = calcCategory.value;
        var qty = parseInt(calcQuantityInput.value) || 100;
        var service = document.querySelector('input[name="service"]:checked').value;

        if (!catKey) {
            calcCategory.focus();
            return;
        }

        var cat = categories[catKey];
        var regCost = cat.reg;
        var codeCost = Math.round(cat.code * qty * 100) / 100;
        var reportCost = 0;
        var total = 0;

        if (service === 'registration') {
            total = regCost;
        } else if (service === 'registration_codes') {
            total = regCost + codeCost;
        } else {
            reportCost = cat.report;
            total = regCost + codeCost + reportCost;
        }

        document.getElementById('resultCategory').textContent = cat.name + ' × ' + formatNumber(qty) + ' шт.';
        document.getElementById('resultRegistration').textContent = formatNumber(regCost) + ' ₽';

        var codesRow = document.getElementById('resultCodesRow');
        var reportRow = document.getElementById('resultReportRow');

        if (service === 'registration') {
            codesRow.style.display = 'none';
            reportRow.style.display = 'none';
        } else if (service === 'registration_codes') {
            codesRow.style.display = 'flex';
            reportRow.style.display = 'none';
            document.getElementById('resultCodes').textContent = formatNumber(codeCost) + ' ₽';
        } else {
            codesRow.style.display = 'flex';
            reportRow.style.display = 'flex';
            document.getElementById('resultCodes').textContent = formatNumber(codeCost) + ' ₽';
            document.getElementById('resultReport').textContent = formatNumber(reportCost) + ' ₽';
        }

        document.getElementById('resultTotal').textContent = formatNumber(total) + ' ₽';

        var selfRegCost = regCost + codeCost + 20000;
        var savings = selfRegCost - total;
        if (savings > 0) {
            document.getElementById('resultSavings').style.display = 'flex';
            document.getElementById('resultSavingsText').textContent =
                'Экономия ' + formatNumber(savings) + ' ₽ по сравнению с самостоятельной настройкой (включая штрафы за ошибки ~20 000 ₽).';
        } else {
            document.getElementById('resultSavings').style.display = 'none';
        }

        var infoText = '';
        if (service === 'registration') {
            infoText = 'Регистрация в ГИС МТ занимает 1-3 рабочих дня. Необходимо ЭЦП и уведомление о начале деятельности.';
        } else if (service === 'registration_codes') {
            infoText = 'Полная настройка за 3-5 рабочих дней. Включает регистрацию, получение доступа к генерации кодов и настройку оборудования.';
        } else {
            infoText = 'Комплексное обслуживание: регистрация, коды, отчётность, интеграция с 1С, техподдержка 24/7. Срок — 5-7 рабочих дней.';
        }
        document.getElementById('resultInfoText').textContent = infoText;

        calcResult.style.display = 'block';
        calcResult.scrollIntoView({ behavior: 'smooth', block: 'start' });

        window._lastCalc = {
            category: cat.name,
            quantity: qty,
            service: service,
            regCost: regCost,
            codeCost: codeCost,
            reportCost: reportCost,
            total: total,
            codePerUnit: cat.code
        };
    }

    calcButton.addEventListener('click', calculate);

    calcDownload.addEventListener('click', function () {
        if (!window._lastCalc) return;
        var c = window._lastCalc;
        var lines = [
            'ОТЧЁТ: РАСЧЁТ СТОИМОСТИ МАРКИРОВКИ',
            '«Честный Знак» — chestniy-znak.online',
            '',
            'Дата: ' + new Date().toLocaleDateString('ru-RU'),
            '',
            'КАТЕГОРИЯ: ' + c.category,
            'КОЛИЧЕСТВО: ' + formatNumber(c.quantity) + ' шт.',
            '',
            'СТОИМОСТЬ:',
            '  Регистрация в ГИС МТ:    ' + formatNumber(c.regCost) + ' ₽',
            '  Стоимость кода:           ' + c.codePerUnit.toFixed(2) + ' ₽/шт.',
            '  Генерация кодов:          ' + formatNumber(c.codeCost) + ' ₽',
        ];
        if (c.reportCost > 0) {
            lines.push('  Отчётность (1 мес.):     ' + formatNumber(c.reportCost) + ' ₽');
        }
        lines.push('');
        lines.push('  ИТОГО:                    ' + formatNumber(c.total) + ' ₽');
        lines.push('');
        lines.push('---');
        lines.push('Расчёт подготовлен: chestniy-znak.online');
        lines.push('Контакт: @RuslanBogatyr0v');

        var blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'raschyot-markirovki-' + c.category.toLowerCase().replace(/\s+/g, '-') + '.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

});
