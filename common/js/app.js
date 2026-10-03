let table = null;
let allData = [];


/* ======================================
   言語設定
====================================== */

const isEnglish = document.documentElement.lang === "en";

const TEXT = isEnglish ? {

    // DataTables
    search: "Search:",
    lengthMenu: "Show _MENU_ entries",
    info: "Showing _START_ to _END_ of _TOTAL_ entries",
    infoEmpty: "Showing 0 to 0 of 0 entries",
    infoFiltered: "(filtered from _MAX_ total entries)",
    zeroRecords: "No matching records found",
    emptyTable: "No data available in table",

    paginate: {
        first: "First",
        last: "Last",
        next: "Next",
        previous: "Previous"
    },

    // 詳細モーダル
    year: "Year",
    type: "Type",
    title: "Title",
    author: "Author",
    theme: "Theme",
    note: "Notes",

    // 年度
    fiscalYear: "FY",

    // 日付・掲載先
    place: {
        paper: "Journal",
        presentation: "Conference",
        award: "Award organization",
        default: "Published in"
    },

    date: {
        paper: "Publication date",
        presentation: "Presentation date",
        award: "Award date",
        default: "Date"
    }

} : {

    // DataTables
    search: "検索:",
    lengthMenu: "_MENU_件表示",
    info: "_TOTAL_件中 _START_～_END_件を表示",
    infoEmpty: "0件中 0～0件を表示",
    infoFiltered: "（全 _MAX_ 件から抽出）",
    zeroRecords: "一致するデータがありません",
    emptyTable: "データがありません",

    paginate: {
        first: "最初",
        last: "最後",
        next: "次へ",
        previous: "前へ"
    },

    // 詳細モーダル
    year: "年度",
    type: "種別",
    title: "タイトル",
    author: "著者",
    theme: "テーマ",
    note: "備考",

    // 年度
    fiscalYear: "年度",

    // 日付・掲載先
    place: {
        paper: "掲載誌",
        presentation: "会議名",
        award: "表彰団体名",
        default: "掲載先"
    },

    date: {
        paper: "発行年月日",
        presentation: "発表年月日",
        award: "受賞年月日",
        default: "日付"
    }

};


/* ======================================
   初期処理
====================================== */

document.addEventListener("DOMContentLoaded", async () => {

    allData = await loadExcel();

    const page = document.body.dataset.page;

    // body属性取得
    const body = document.body;

    const view = body.dataset.view;
    const year = body.dataset.year;
    const theme = body.dataset.theme;


    /* ----------------------------------
       URLパラメータで絞り込み
    ---------------------------------- */

    let data = applyFilter(allData);


    /* ----------------------------------
       body指定があればさらに絞り込み
    ---------------------------------- */

    if (view) {

        data = data.filter(
            item => item.category === view
        );

    }


    /* ----------------------------------
       年度別ページ
    ---------------------------------- */

    if (page === "year") {

        const params = new URLSearchParams(location.search);

        // year指定がない場合
        if (!params.get("year")) {

            // Excelから最新年度取得
            const latestYear = Math.max(
                ...allData.map(
                    item => Number(item.year)
                )
            );

            location.replace(
                `year.html?year=${latestYear}`
            );

            return;
        }

    }


    /* ----------------------------------
       bodyのyear指定
    ---------------------------------- */

    if (year) {

        data = data.filter(
            item =>
                String(item.year) === String(year)
        );

    }


    /* ----------------------------------
       bodyのtheme指定
    ---------------------------------- */

    if (theme) {

        data = data.filter(
            item => item.theme === theme
        );

    }


    /* ----------------------------------
       年度メニュー
    ---------------------------------- */

    if (page === "year") {

        createYearMenu(allData);

    }


    /* ----------------------------------
       テーブル表示
    ---------------------------------- */

    renderTable(data);

});


/* ======================================
   DataTables表示
====================================== */

function renderTable(data) {

    if (table) {

        table.destroy();

        document.querySelector(
            "#resultTable tbody"
        ).innerHTML = "";

    }


    table = new DataTable("#resultTable", {

        data: data,

        pageLength: 20,

        order: [
            [isEnglish ? 4 : 5, "desc"]
        ],
		
    columnDefs: [

        // 英語版ではCategory列を非表示
        {
            targets: 1,
            visible: !isEnglish
        }

    ],

        language: {

            // Google CDNの日本語JSONは使わず
            // 日本語・英語をここで切り替える
            search: TEXT.search,

            lengthMenu: TEXT.lengthMenu,

            info: TEXT.info,

            infoEmpty: TEXT.infoEmpty,

            infoFiltered: TEXT.infoFiltered,

            zeroRecords: TEXT.zeroRecords,

            emptyTable: TEXT.emptyTable,

            paginate: TEXT.paginate

        },


        columns: [

            /* ----------------------------------
               タイトル
            ---------------------------------- */

            {

                data: "title",

                render: function (
                    data,
                    type,
                    row
                ) {

                    return `

                        <a href="#"
                           class="detail"
                           data-title="${encodeURIComponent(row.title)}">

                            ${data}

                        </a>

                    `;

                }

            },


            /* ----------------------------------
               種別
            ---------------------------------- */

            {
                data: "category"
            },


            /* ----------------------------------
               年度
            ---------------------------------- */

            {
                data: "year"
            },


            /* ----------------------------------
               著者
            ---------------------------------- */

            {
                data: "author"
            },


            /* ----------------------------------
               掲載先
            ---------------------------------- */

            {
                data: "place"
            },


            /* ----------------------------------
               日付
            ---------------------------------- */

            {

                data: "date",

                render: function (data) {

                    if (!data) return "";

                    // Excelシリアル値対応
                    if (typeof data === "number") {

                        const d =
                            XLSX.SSF.parse_date_code(data);

                        return `${d.y}/${String(d.m).padStart(2, "0")}/${String(d.d).padStart(2, "0")}`;

                    }

                    return data;

                }

            },


            /* ----------------------------------
               テーマ
            ---------------------------------- */

            {
                data: "theme"
            }

        ]

    });

}


/* ======================================
   モーダル
====================================== */

function openModal(item) {

    document.querySelector(
        "#modalTitle"
    ).textContent = item.title;


    document.querySelector(
        "#modalBody"
    ).innerHTML = createDetailTable(item);


    document.querySelector(
        "#detailModal"
    ).classList.add("show");

}


function closeModal() {

    document.querySelector(
        "#detailModal"
    ).classList.remove("show");

}


/* ======================================
   モーダル閉じる
====================================== */

document.addEventListener("DOMContentLoaded", () => {

    const closeButton =
        document.querySelector(".modal-close");

    const modal =
        document.querySelector("#detailModal");


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeModal
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            function (e) {

                if (e.target === this) {

                    closeModal();

                }

            }
        );

    }

});


/* ======================================
   ESCキーで閉じる
====================================== */

document.addEventListener(
    "keydown",
    function (e) {

        if (e.key === "Escape") {

            closeModal();

        }

    }
);


/* ======================================
   詳細テーブル生成
====================================== */

function createDetailTable(item) {

    return `

        <table class="detail-table">

            <tr>
                <th>${TEXT.year}</th>
                <td>${item.year}</td>
            </tr>

            <tr>
                <th>${TEXT.type}</th>
                <td>${item.type}</td>
            </tr>

            <tr>
                <th>${TEXT.title}</th>
                <td>${item.title}</td>
            </tr>

            <tr>
                <th>${TEXT.author}</th>
                <td>${item.author}</td>
            </tr>

            <tr>
                <th>${getPlaceLabel(item.category)}</th>
                <td>${item.place}</td>
            </tr>

            <tr>
                <th>${getDateLabel(item.category)}</th>
                <td>${item.date}</td>
            </tr>

            <tr>
                <th>${TEXT.theme}</th>
                <td>${item.theme}</td>
            </tr>

            <tr>
                <th>${TEXT.note}</th>
                <td>${item.note}</td>
            </tr>

        </table>

    `;

}


/* ======================================
   タイトルクリック
====================================== */

document.addEventListener(
    "click",
    function (e) {

        const link =
            e.target.closest(".detail");

        if (!link) return;

        e.preventDefault();


        const title =
            decodeURIComponent(
                link.dataset.title
            );


        const item =
            allData.find(
                data => data.title === title
            );


        if (!item) return;


        openModal(item);

    }
);


/* ======================================
   掲載先ラベル
====================================== */

function getPlaceLabel(category) {

    switch (category) {

        case "論文":

            return TEXT.place.paper;


        case "発表":

            return TEXT.place.presentation;


        case "受賞":

            return TEXT.place.award;


        default:

            return TEXT.place.default;

    }

}


/* ======================================
   日付ラベル
====================================== */

function getDateLabel(category) {

    switch (category) {

        case "論文":

            return TEXT.date.paper;


        case "発表":

            return TEXT.date.presentation;


        case "受賞":

            return TEXT.date.award;


        default:

            return TEXT.date.default;

    }

}


/* ======================================
   年度メニュー自動表示
====================================== */

function createYearMenu(data) {

    const years = [
        ...new Set(
            data.map(
                item => item.year
            )
        )
    ]
    .sort(
        (a, b) => b - a
    );


    const currentYear =
        new URLSearchParams(
            location.search
        ).get("year") ||
        years[0];


    const nav =
        document.querySelector("#yearNav");


    if (!nav) return;


    nav.innerHTML =
        years.map(year => `

            <a href="year.html?year=${year}"
               class="${year == currentYear ? "current" : ""}">

                ${isEnglish ? "FY" + year : year + TEXT.fiscalYear}

            </a>

        `).join("");

}


/* ======================================
   年度別ハイライト
====================================== */

async function loadHighlight(year) {

    const area =
        document.querySelector("#highlight");


    if (!area) return;


    try {

        const html =
            await fetch(
                `highlight/${year}.html`
            )
            .then(
                response => response.text()
            );


        area.innerHTML = html;


    } catch (e) {

        area.innerHTML = "";

    }

}


/* ======================================
   URLの年度を取得
====================================== */

const highlightYear =
    new URLSearchParams(
        location.search
    ).get("year");


if (highlightYear) {

    loadHighlight(highlightYear);

}


/* ======================================
   Excel読込
====================================== */

async function loadExcel() {

    const response =
        await fetch(
            "data/publish.xlsx?v=202609252"
        );


    const arrayBuffer =
        await response.arrayBuffer();


    const workbook =
        XLSX.read(
            arrayBuffer,
            {
                type: "array",
                cellDates: true
            }
        );


    let allData = [];


    workbook.SheetNames.forEach(
        sheetName => {

            // 論文・発表だけ読む
            if (
                ![
                    "論文",
                    "発表"
                ].includes(sheetName)
            ) return;


            const sheet =
                workbook.Sheets[sheetName];


            const rows =
                XLSX.utils.sheet_to_json(
                    sheet,
                    {
                        defval: ""
                    }
                );


            rows.forEach(row => {

                let author = "";
                let place = "";
                let date = "";


                switch (sheetName) {

                    case "論文":

                        author =
                            row["著者"];

                        place =
                            row["掲載誌"];

                        date =
                            row["発行年月日"];

                        break;


                    case "発表":

                        author =
                            row["著者"];

                        place =
                            row["会議名"];

                        date =
                            row["発表年月日"];

                        break;

                }


                // タイトルがない行は除外
                if (!row["タイトル"]) return;


                allData.push({

                    category:
                        sheetName,

                    year:
                        row["年度"] || "",

                    type:
                        row["種別"] || "",

                    title:
                        row["タイトル"] || "",

                    author:
                        author || "",

                    place:
                        place || "",

                    date:
                        formatDate(date),

                    theme:
                        row["研究領域"] || "",

                    note:
                        row["備考"] || "",

                    raw:
                        row

                });

            });

        }
    );


    console.table(
        allData.slice(0, 5)
    );


    return allData;

}


/* ======================================
   日付整形
====================================== */

function formatDate(value) {

    if (!value) return "";


    // Dateオブジェクト
    if (value instanceof Date) {

        const y =
            value.getFullYear();

        const m =
            String(
                value.getMonth() + 1
            ).padStart(2, "0");

        const d =
            String(
                value.getDate()
            ).padStart(2, "0");


        return `${y}/${m}/${d}`;

    }


    // Excelシリアル値
    if (typeof value === "number") {

        const date =
            XLSX.SSF.parse_date_code(
                value
            );


        if (!date) return value;


        const y =
            date.y;

        const m =
            String(date.m)
                .padStart(2, "0");

        const d =
            String(date.d)
                .padStart(2, "0");


        return `${y}/${m}/${d}`;

    }


    return value;

}


/* ======================================
   フィルター
====================================== */

function applyFilter(data) {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const view =
        params.get("view");


    const year =
        params.get("year");


    const theme =
        params.get("theme");


    let result =
        [...data];


    /* ----------------------------------
       論文・発表・受賞
    ---------------------------------- */

    if (
        view &&
        [
            "論文",
            "発表",
            "受賞"
        ].includes(view)
    ) {

        result =
            result.filter(
                item =>
                    item.category === view
            );

    }


    /* ----------------------------------
       年度
    ---------------------------------- */

    if (year) {

        result =
            result.filter(
                item =>
                    item.year == year
            );

    }


    /* ----------------------------------
       テーマ
    ---------------------------------- */

    if (theme) {

        result =
            result.filter(
                item =>
                    item.theme === theme
            );

    }


    return result;

}