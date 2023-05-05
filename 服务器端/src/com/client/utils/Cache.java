package com.client.utils;

/**
 需求分析
项目中经常会遇到这种场景：一份数据需要在多处共享，有些数据还有时效性，过期自动失效。比如手机验证码，发送之后需要缓存起来，然后处于安全性考虑，一般还要设置有效期，到期自动失效。我们怎么实现这样的功能呢？

解决方案
使用现有的缓存技术框架，比如redis,ehcache。优点：成熟，稳定，功能强大；缺点，项目需要引入对应的框架，不够轻量。
如果不考虑分布式，只是在单线程或者多线程间作数据缓存，其实完全可以自己手写一个缓存工具。下面就来简单实现一个这样的工具


说明
本工具类主要采用HashMap+定时器线程池实现，map用于存储键值对数据，map的value是Cache的内部类对象Entity，Entity包含value和该键值对的生命周期定时器Future。Cache类对外只提供了几个同步方法:

方法	作用
put(key, value)	插入缓存数据
put(key, value, expire)	插入带过期时间的缓存数据， expire: 过期时间，单位：毫秒
get(key)	获取缓存数据
remove(key)	删除缓存数据
size()	查询当前缓存记录数
当添加键值对数据的时候，首先会调用remove()方法，清除掉原来相同key的数据，并取消对应的定时清除任务，然后添加新数据到map中，并且，如果设置了有效时间，则添加对应的定时清除任务到定时器线程池。
————————————————
版权声明：本文为CSDN博主「浅醉樱花雨」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/u013314786/article/details/80658738
 */

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @Author: lixk 
 * @Description: 简单的内存缓存工具类
 */
public class Cache {
    /**
     * 键值对集合
     */
    private final static Map<String, Entity> map = new HashMap<String,Entity>();
    /**
     * 定时器线程池，用于清除过期缓存
     */
    private final static ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();

    /**
     * 添加缓存
     *
     * @param key  键
     * @param data 值
     */
    public synchronized static void put(String key, Object data) {
        Cache.put(key, data, 0);
    }

    /**
     * 添加缓存
     *
     * @param key    键
     * @param data   值
     * @param expire 过期时间，单位：毫秒， 0表示无限长
     */
    public synchronized static void put(final String key, Object data, long expire) {
        //清除原键值对
        Cache.remove(key);
        //设置过期时间
        if (expire > 0) {
            Future future = executor.schedule(new Runnable() {
                @Override
                public void run() {
                    //过期后清除该键值对
                    synchronized (Cache.class) {
                        map.remove(key);
                    }
                }
            }, expire, TimeUnit.MILLISECONDS);
            map.put(key, new Entity(data, future));
        } else {
            //不设置过期时间
            map.put(key, new Entity(data, null));
        }
    }

    /**
     * 读取缓存
     *
     * @param key 键
     * @return
     */
    public synchronized static <T> T get(String key) {
        Entity entity = map.get(key);
        return entity == null ? null : (T) entity.value;
    }

    /**
     * 清除缓存
     *
     * @param key 键
     * @return
     */
    public synchronized static <T> T remove(String key) {
        //清除原缓存数据
        Entity entity = map.remove(key);
        if (entity == null) {
            return null;
        }
        //清除原键值对定时器
        if (entity.future != null) {
            entity.future.cancel(true);
        }
        return (T) entity.value;
    }

    /**
     * 查询当前缓存的键值对数量
     *
     * @return
     */
    public synchronized static int size() {
        return map.size();
    }

    /**
     * 缓存实体类
     */
    private static class Entity {
        /**
         * 键值对的value
         */
        public Object value;
        /**
         * 定时器Future
         */
        public Future future;

        public Entity(Object value, Future future) {
            this.value = value;
            this.future = future;
        }
    }
    
    
    
    
    /**
     * 测试
     *
     * @param args
     */
    public static void main(String[] args) throws InterruptedException {
        String key = "id";
        //不设置过期时间
        System.out.println("***********不设置过期时间**********");
        Cache.put(key, 123);
        System.out.println("key:" + key + ", value:" + Cache.get(key));
        System.out.println("key:" + key + ", value:" + Cache.remove(key));
        System.out.println("key:" + key + ", value:" + Cache.get(key));
        
        

        //设置过期时间
        System.out.println("\n***********设置过期时间**********");
        Cache.put(key, "123456", 1000);
        System.out.println("key:" + key + ", value:" + Cache.get(key));
        Thread.sleep(2000);
        System.out.println("key:" + key + ", value:" + Cache.get(key));
        
        

        System.out.println("\n***********100w读写性能测试************");
        //创建有10个线程的线程池，将1000000次操作分10次添加到线程池
        int threads = 10;
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        //每批操作数量
        int batchSize = 100000;

        //添加
        {
            CountDownLatch latch = new CountDownLatch(threads);
            AtomicInteger n = new AtomicInteger(0);
            long start = System.currentTimeMillis();

            for (int t = 0; t < threads; t++) {
            	/*
                pool.submit(() -> {
                    for (int i = 0; i < batchSize; i++) {
                        int value = n.incrementAndGet();
                        Cache.put(key + value, value, 300000);
                    }
                    latch.countDown();
                });*/
            }
            //等待全部线程执行完成，打印执行时间
            latch.await();
            System.out.printf("添加耗时：%dms\n", System.currentTimeMillis() - start);
        }

        //查询
        {
            CountDownLatch latch = new CountDownLatch(threads);
            AtomicInteger n = new AtomicInteger(0);
            long start = System.currentTimeMillis();
            for (int t = 0; t < threads; t++) {
            	/*
                pool.submit(() -> {
                    for (int i = 0; i < batchSize; i++) {
                        int value = n.incrementAndGet();
                        Cache.get(key + value);
                    }
                    latch.countDown();
                });*/
            }
            //等待全部线程执行完成，打印执行时间
            latch.await();
            System.out.printf("查询耗时：%dms\n", System.currentTimeMillis() - start);
        }

        System.out.println("当前缓存容量：" + Cache.size());
    } 
    
    
    
    
}