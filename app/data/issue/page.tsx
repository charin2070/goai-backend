import React from "react";
import { Button } from "@/components/button";
import { Link } from "@/components/link";
import { PaperClipIcon } from "@heroicons/react/24/solid";

export default function DataPage() {
  return (
    <html lang="ru">
      <body>
    <div className="flex flex-col w-[1358px] h-[1065px] items-start relative bg-gray-100">
      <div className="flex h-16 items-center justify-around gap-[106px] relative self-stretch w-full bg-white shadow-shadow-sm">
        <div className="flex w-[1280px] items-center justify-between px-8 py-0 relative self-stretch">
          <div className="inline-flex items-center gap-6 relative flex-[0_0_auto]">
            <img className="relative w-12 h-12" alt="Logo" src="/placeholder.svg" />

            <div className="inline-flex items-start gap-4 relative flex-[0_0_auto]">
              <Link href="#">
                Data
              </Link>
              <Link href="#">API</Link>
              <Link href="#">Server</Link>
            </div>
          </div>

          <div className="inline-flex items-center gap-3 pl-6 pr-0 py-0 relative flex-[0_0_auto]">
            <Button>Action</Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-0 py-10 flex-1 w-full grow relative self-stretch">
        <div className="w-[1280px] px-8 py-0 flex-[0_0_auto] flex items-start relative">
          <div className="flex-col gap-1 px-6 py-5 flex-1 grow flex items-start relative">
            <div className="relative self-stretch mt-[-1.00px] font-text-lg-leading-6-font-medium font-[number:var(--text-lg-leading-6-font-medium-font-weight)] text-gray-900 text-[length:var(--text-lg-leading-6-font-medium-font-size)] tracking-[var(--text-lg-leading-6-font-medium-letter-spacing)] leading-[var(--text-lg-leading-6-font-medium-line-height)] [font-style:var(--text-lg-leading-6-font-medium-font-style)]">
              Данные
            </div>

            <div className="relative self-stretch font-text-sm-leading-5-font-normal font-[number:var(--text-sm-leading-5-font-normal-font-weight)] text-gray-500 text-[length:var(--text-sm-leading-5-font-normal-font-size)] tracking-[var(--text-sm-leading-5-font-normal-letter-spacing)] leading-[var(--text-sm-leading-5-font-normal-line-height)] [font-style:var(--text-sm-leading-5-font-normal-font-style)]">
              Собранные и нормализованные данные
            </div>
          </div>
        </div>

        <div className="flex flex-col w-[1280px] items-center justify-center p-8 relative flex-1 grow">
          <div className="flex flex-col w-[896px] items-start relative flex-[0_0_auto] bg-white rounded-lg overflow-hidden shadow-shadow-base">
            <div className="flex-col gap-1 px-6 py-5 self-stretch w-full flex-[0_0_auto] flex items-start relative">
              <div className="relative self-stretch mt-[-1.00px] font-text-lg-leading-6-font-medium font-[number:var(--text-lg-leading-6-font-medium-font-weight)] text-gray-900 text-[length:var(--text-lg-leading-6-font-medium-font-size)] tracking-[var(--text-lg-leading-6-font-medium-letter-spacing)] leading-[var(--text-lg-leading-6-font-medium-line-height)] [font-style:var(--text-lg-leading-6-font-medium-font-style)]">
                Задачи в Jira
              </div>

              <div className="relative self-stretch font-text-sm-leading-5-font-normal font-[number:var(--text-sm-leading-5-font-normal-font-weight)] text-gray-500 text-[length:var(--text-sm-leading-5-font-normal-font-size)] tracking-[var(--text-sm-leading-5-font-normal-letter-spacing)] leading-[var(--text-sm-leading-5-font-normal-line-height)] [font-style:var(--text-sm-leading-5-font-normal-font-style)]">
                структура объектов: Issue
              </div>
            </div>

            <div className="relative self-stretch w-full h-px bg-gray-200" />

            <div className="flex flex-col items-center justify-center w-full flex-[0_0_auto] relative self-stretch">
              <div className="flex flex-col items-start justify-center px-6 py-5 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-full h-5 relative self-stretch">
                  <div className="absolute w-[272px] -top-px left-0 font-text-sm-leading-5-font-medium font-[number:var(--text-sm-leading-5-font-medium-font-weight)] text-gray-500 text-[length:var(--text-sm-leading-5-font-medium-font-size)] tracking-[var(--text-sm-leading-5-font-medium-letter-spacing)] leading-[var(--text-sm-leading-5-font-medium-line-height)] [font-style:var(--text-sm-leading-5-font-medium-font-style)]">
                    Источник
                  </div>

                  <div className="absolute w-[560px] -top-px left-72 font-text-sm-leading-5-font-normal font-[number:var(--text-sm-leading-5-font-normal-font-weight)] text-gray-900 text-[length:var(--text-sm-leading-5-font-normal-font-size)] tracking-[var(--text-sm-leading-5-font-normal-letter-spacing)] leading-[var(--text-sm-leading-5-font-normal-line-height)] [font-style:var(--text-sm-leading-5-font-normal-font-style)]">
                    Jira
                  </div>
                </div>
              </div>

              <div className="relative self-stretch w-full h-px bg-gray-200" />

              <div className="flex flex-col items-start justify-center px-6 py-5 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-full h-5 relative self-stretch">
                  <div className="absolute w-[272px] -top-px left-0 font-text-sm-leading-5-font-medium font-[number:var(--text-sm-leading-5-font-medium-font-weight)] text-gray-500 text-[length:var(--text-sm-leading-5-font-medium-font-size)] tracking-[var(--text-sm-leading-5-font-medium-letter-spacing)] leading-[var(--text-sm-leading-5-font-medium-line-height)] [font-style:var(--text-sm-leading-5-font-medium-font-style)]">
                    Схема данных
                  </div>

                  <div className="absolute w-[560px] -top-px left-72 font-text-sm-leading-5-font-normal font-[number:var(--text-sm-leading-5-font-normal-font-weight)] text-gray-900 text-[length:var(--text-sm-leading-5-font-normal-font-size)] tracking-[var(--text-sm-leading-5-font-normal-letter-spacing)] leading-[var(--text-sm-leading-5-font-normal-line-height)] [font-style:var(--text-sm-leading-5-font-normal-font-style)]">
                    Issue
                  </div>
                </div>
              </div>

              <div className="relative self-stretch w-full h-px bg-gray-200" />

              <div className="flex flex-col items-start justify-center px-6 py-5 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-full h-5 relative self-stretch">
                  <div className="absolute w-[272px] -top-px left-0 font-text-sm-leading-5-font-medium font-[number:var(--text-sm-leading-5-font-medium-font-weight)] text-gray-500 text-[length:var(--text-sm-leading-5-font-medium-font-size)] tracking-[var(--text-sm-leading-5-font-medium-letter-spacing)] leading-[var(--text-sm-leading-5-font-medium-line-height)] [font-style:var(--text-sm-leading-5-font-medium-font-style)]">
                    Количество записей
                  </div>

                  <div className="absolute w-[560px] -top-px left-72 font-text-sm-leading-5-font-normal font-[number:var(--text-sm-leading-5-font-normal-font-weight)] text-gray-900 text-[length:var(--text-sm-leading-5-font-normal-font-size)] tracking-[var(--text-sm-leading-5-font-normal-letter-spacing)] leading-[var(--text-sm-leading-5-font-normal-line-height)] [font-style:var(--text-sm-leading-5-font-normal-font-style)]">
                    0
                  </div>
                </div>
              </div>

              <div className="relative self-stretch w-full h-px bg-gray-200" />

              <div className="flex flex-col items-start justify-center px-6 py-5 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-full h-5 relative self-stretch">
                  <div className="absolute w-[272px] -top-px left-0 font-text-sm-leading-5-font-medium font-[number:var(--text-sm-leading-5-font-medium-font-weight)] text-gray-500 text-[length:var(--text-sm-leading-5-font-medium-font-size)] tracking-[var(--text-sm-leading-5-font-medium-letter-spacing)] leading-[var(--text-sm-leading-5-font-medium-line-height)] [font-style:var(--text-sm-leading-5-font-medium-font-style)]">
                    Последнее обновление
                  </div>

                  <div className="absolute w-[560px] -top-px left-72 font-text-sm-leading-5-font-normal font-[number:var(--text-sm-leading-5-font-normal-font-weight)] text-gray-900 text-[length:var(--text-sm-leading-5-font-normal-font-size)] tracking-[var(--text-sm-leading-5-font-normal-letter-spacing)] leading-[var(--text-sm-leading-5-font-normal-line-height)] [font-style:var(--text-sm-leading-5-font-normal-font-style)]">
                    никогда
                  </div>
                </div>
              </div>

              <div className="relative self-stretch w-full h-px bg-gray-200" />

              <div className="flex flex-col items-start justify-center px-6 py-5 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-full h-20 relative self-stretch">
                  <div className="absolute w-[272px] -top-px left-0 font-text-sm-leading-5-font-medium font-[number:var(--text-sm-leading-5-font-medium-font-weight)] text-gray-500 text-[length:var(--text-sm-leading-5-font-medium-font-size)] tracking-[var(--text-sm-leading-5-font-medium-letter-spacing)] leading-[var(--text-sm-leading-5-font-medium-line-height)] [font-style:var(--text-sm-leading-5-font-medium-font-style)]">
                    Храниллище
                  </div>

                  <div className="absolute w-[560px] -top-px left-72 font-text-sm-leading-5-font-normal font-[number:var(--text-sm-leading-5-font-normal-font-weight)] text-gray-900 text-[length:var(--text-sm-leading-5-font-normal-font-size)] tracking-[var(--text-sm-leading-5-font-normal-letter-spacing)] leading-[var(--text-sm-leading-5-font-normal-line-height)] [font-style:var(--text-sm-leading-5-font-normal-font-style)]">
                    VPS PostgresSQL
                  </div>
                </div>
              </div>

              <div className="relative self-stretch w-full h-px bg-gray-200" />

              <div className="flex flex-col items-start justify-center px-6 py-5 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-full h-[91px] relative self-stretch">
                  <div className="absolute w-[272px] -top-px left-0 font-text-sm-leading-5-font-medium font-[number:var(--text-sm-leading-5-font-medium-font-weight)] text-gray-500 text-[length:var(--text-sm-leading-5-font-medium-font-size)] tracking-[var(--text-sm-leading-5-font-medium-letter-spacing)] leading-[var(--text-sm-leading-5-font-medium-line-height)] [font-style:var(--text-sm-leading-5-font-medium-font-style)]">
                    Экспорт
                  </div>

                  <div className="flex flex-col w-[560px] items-start absolute top-0 left-72 rounded-md overflow-hidden border border-solid border-gray-200">
                    <div className="flex items-start gap-4 pl-[13px] pr-[17px] pt-[13px] pb-3 relative self-stretch w-full flex-[0_0_auto]">
                      <div className="flex items-start gap-2 relative flex-1 grow">
                        <PaperClipIcon className="!relative !w-5 !h-5 text-gray-400" />
                        <div className="relative w-fit mt-[-1.00px] font-text-sm-leading-5-font-normal font-[number:var(--text-sm-leading-5-font-normal-font-weight)] text-gray-900 text-[length:var(--text-sm-leading-5-font-normal-font-size)] tracking-[var(--text-sm-leading-5-font-normal-letter-spacing)] leading-[var(--text-sm-leading-5-font-normal-line-height)] whitespace-nowrap [font-style:var(--text-sm-leading-5-font-normal-font-style)]">
                          go-ai-data-export.csv
                        </div>
                      </div>

                      <Button>Сохранить</Button>
                    </div>

                    <div className="relative self-stretch w-full h-px bg-gray-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </body>
    </html>
  );
} 