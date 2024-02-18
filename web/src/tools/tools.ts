/**
 * 同步长耗时任务
 * @param timer 时长，毫秒
 */
export function syncLongTimeConsumeTask(timer: number = 1000) {
    // 同步死循环方式，会导致build失败

    // const startTime = performance.now()
    // while (performance.now() - startTime < timer) {
    //     // 模拟长耗时计算
    //     console.log(performance.now() - startTime);
        
    // }
}

export async function getDataAfter2Second() {
    await new Promise((resolve) => {
        setTimeout(() => { }, 2000)
    })
    return {
        title: 'getDataAfter2Second',
        data: 'default'
    }
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}