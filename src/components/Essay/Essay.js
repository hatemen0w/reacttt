import React from "react";
import "./Essay.css";

class Essay extends React.Component {

    render() {
        return(
            <div className='essay_container'>
                <div className='essay_content_container'>
                    <div className='essay_sidebar_left'></div>
                    <div className='essay_info'>
                        <div className='header'>
                            <h1>Кто я, как я попал в УдГУ, и что я хочу получить от обучения здесь.</h1>
                        </div>
                        <div className='essay_main_info'>
                            Ну начнём с того, я деревенский касипоша, который должен был стать каким-нибудь
                            каменщиком и работать без отдыха три дня, но к сожалению я родился слишком умным для этого, поэтому
                            меня понесло в точные науки, которые дали мне возможность реализовывать мою страсть по жизни - это
                            решать сложные логические задачки. Таким образом меня и заинтересовало программирование, ведь сама
                            его концепция состоит из постоянного решения разной сложности задач.
                        </div>
                        <div className='essay_main_info'>
                            Почему я выбрал для обучению программированию именно УдГУ, ну тут ответ довольно банальный и
                            простой: потому что в другие места не получилось. Вообще в теории мне всё равно, где
                            обучаться, не думаю, что в вузах уровня УдГУ и выше не сильно различается само обучение, потому
                            что в итоге сам итог обучения определяется усилиями, которые приложил студент, для получения
                            образования.
                        </div>
                        <div className='essay_main_info'>
                            Ну от УдГУ я хочу получить только знания, которые в большинстве мне не понадобятся в настоящей
                            работе, зато это возможность узнать таких же болванчиков, которые, может быть, также как и я,
                            решили, что, наверно, стоит всё же сходить в вуз, может чему-то да научат.
                        </div>
                    </div>
                    <div className='essay_sidebar_right'></div>
                </div>
            </div>
        );
    }
}
export default Essay;