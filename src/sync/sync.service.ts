import { Injectable } from '@nestjs/common';

@Injectable()
export class SyncService {
    private mockDB = [];

    handlePush(data: any) {
        
        return { status: 'ok' };
    }

    handlePull() {

        return { status: 'ok' };
    }
}
