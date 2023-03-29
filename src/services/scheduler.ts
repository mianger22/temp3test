import request from '@/utils/request';
import { SchuduleItem } from '@/models/scheduler'

export async function query(): Promise<any> {
    return request('/api/v1/chats/schedules/');
}

export async function add(data: SchuduleItem): Promise<any> {
    return request('/api/v1/chats/schedules/', {
        method: 'POST',
        data: data,
    });
}

export async function remove(id: string): Promise<any> {
    return request(`/api/v1/chats/schedules/${id}`, {
        method: 'DELETE'
    });
}


export async function update(data: SchuduleItem): Promise<any> {

    return request(`/api/v1/chats/schedules/${data.id}`, {
        method: 'PATCH',
        data: data
    });
}